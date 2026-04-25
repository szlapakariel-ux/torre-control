// ── Config ────────────────────────────────────────────
const BACKEND_URL  = 'http://localhost:3001/api/message';
const BROWSE_URL   = 'http://localhost:3001/api/browse';

const INTENT_LABELS = {
  error:            'Error',
  tarea:            'Tarea',
  'decisión':       'Decisión',
  duda:             'Duda',
  idea:             'Idea',
  browser:          'Navegador',
  consulta_general: 'Consulta',
};

// ── DOM refs ──────────────────────────────────────────
const chatMessages  = document.getElementById('chatMessages');
const chatInput     = document.getElementById('chatInput');
const sendButton    = document.getElementById('sendButton');
const micButton     = document.getElementById('micButton');
const jarviszToggle = document.getElementById('jarviszToggle');
const jarviszLabel  = document.getElementById('jarviszLabel');
const jarviszStatus = document.getElementById('jarviszStatus');
const statusLabel   = document.getElementById('statusLabel');

// ── Capability detection ──────────────────────────────
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSTT = !!SpeechRecognition;
const hasTTS = 'speechSynthesis' in window;

// ── State ─────────────────────────────────────────────
let jarviszEnabled = false;
let currentState   = 'idle'; // idle | listening | thinking | speaking

const STATE_LABELS = {
  idle:      '⚪ Esperando',
  listening: '🟡 Escuchando...',
  thinking:  '🔵 Pensando...',
  speaking:  '🟣 Hablando...',
};

function setState(state) {
  currentState = state;
  jarviszStatus.dataset.state = state;
  statusLabel.textContent = STATE_LABELS[state];
  micButton.classList.toggle('listening', state === 'listening');
}

// ── Chat helpers ──────────────────────────────────────
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessage(text, role) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message', role);

  const avatar = document.createElement('div');
  avatar.classList.add('message-avatar');
  avatar.textContent = role === 'user' ? 'Vos' : 'TC';

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.textContent = text;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  return wrapper;
}

function createSystemMessage(text, intent) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message', 'system');

  const avatar = document.createElement('div');
  avatar.classList.add('message-avatar');
  avatar.textContent = 'TC';

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble', 'message-bubble-body');

  if (intent && INTENT_LABELS[intent]) {
    const tag = document.createElement('span');
    tag.classList.add('intent-tag', `intent-${intent}`);
    tag.textContent = INTENT_LABELS[intent];
    bubble.appendChild(tag);
  }

  const body = document.createElement('span');
  body.textContent = text;
  bubble.appendChild(body);

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  return wrapper;
}

function createTypingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message', 'system', 'typing-indicator');

  const avatar = document.createElement('div');
  avatar.classList.add('message-avatar');
  avatar.textContent = 'TC';

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.classList.add('typing-dot');
    bubble.appendChild(dot);
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  return wrapper;
}

// ── URL detection ─────────────────────────────────────
const URL_REGEX = /https?:\/\/[^\s"'<>]+/i;

function extractURL(text) {
  const match = text.match(URL_REGEX);
  if (!match) return null;

  let url = match[0];
  // Strip unbalanced trailing closing parentheses one at a time
  let opens  = (url.match(/\(/g) || []).length;
  let closes = (url.match(/\)/g) || []).length;
  while (closes > opens && url.endsWith(')')) {
    url = url.slice(0, -1);
    closes--;
  }
  // Strip remaining trailing sentence punctuation after parenthesis balancing
  url = url.replace(/[.,;!?]+$/, '');
  return url;
}

// ── Send message (async → backend) ───────────────────
async function sendMessage(autoSend = false) {
  const text = chatInput.value.trim();
  if (!text) return;

  chatMessages.appendChild(createMessage(text, 'user'));
  chatInput.value = '';
  chatInput.style.height = 'auto';
  sendButton.disabled = true;
  scrollToBottom();

  setState('thinking');

  const typing = createTypingIndicator();
  chatMessages.appendChild(typing);
  scrollToBottom();

  let responseText = '';
  let messageToSend = text;

  // ── If the message contains a URL, fetch page content first ──
  const detectedUrl = extractURL(text);
  if (detectedUrl) {
    try {
      const browseRes  = await fetch(BROWSE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: detectedUrl }),
      });
      const browseData = await browseRes.json();
      if (browseData.ok && browseData.text) {
        messageToSend = `${text}\n\n[Contenido de ${detectedUrl}]:\n${browseData.text}`;
      } else {
        chatMessages.appendChild(createSystemMessage('⚠️ No se pudo leer la página indicada. El mensaje se enviará sin el contenido.', null));
        scrollToBottom();
      }
    } catch {
      chatMessages.appendChild(createSystemMessage('⚠️ No se pudo acceder a la URL. El mensaje se enviará sin el contenido.', null));
      scrollToBottom();
    }
  }

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: document.getElementById('projectSelector').value,
        mode: 'pensar',
        message: messageToSend,
      }),
    });

    const data = await res.json();
    typing.remove();

    if (data.ok) {
      chatMessages.appendChild(createSystemMessage(data.response, data.intent));
      responseText = data.response;
    } else {
      const msg = 'Hubo un problema procesando tu mensaje.';
      chatMessages.appendChild(createSystemMessage(msg, null));
      responseText = msg;
    }
  } catch {
    typing.remove();
    const msg = 'No se pudo conectar con el backend. Verificá que esté corriendo en puerto 3001.';
    chatMessages.appendChild(createSystemMessage(msg, 'error'));
    responseText = msg;
  }

  sendButton.disabled = false;
  scrollToBottom();

  if (jarviszEnabled && responseText) {
    setState('speaking');
    speak(responseText, () => {
      if (jarviszEnabled) startListening();
      else setState('idle');
    });
  } else {
    setState('idle');
  }
}

// ── Speech Synthesis (TTS) ────────────────────────────
function speak(text, onEnd) {
  if (!hasTTS) { onEnd?.(); return; }
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang  = 'es-AR';
  utterance.rate  = 1.05;
  utterance.pitch = 1;
  utterance.onend   = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  speechSynthesis.speak(utterance);
}

// ── Speech Recognition (STT) ──────────────────────────
let recognition = null;

function buildRecognition() {
  if (!hasSTT) return null;
  const r = new SpeechRecognition();
  r.lang = 'es-AR';
  r.continuous = false;
  r.interimResults = false;

  r.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    chatInput.value = transcript;
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';

    if (jarviszEnabled) sendMessage(true);
    else setState('idle');
  };

  r.onerror = (e) => {
    if (e.error !== 'no-speech') console.warn('STT error:', e.error);
    setState('idle');
  };

  r.onend = () => {
    if (currentState === 'listening') setState('idle');
  };

  return r;
}

function startListening() {
  if (!hasSTT) {
    alert('Tu navegador no soporta reconocimiento de voz. Usá Chrome o Edge.');
    return;
  }
  recognition = buildRecognition();
  try {
    recognition.start();
    setState('listening');
  } catch (e) {
    console.warn('Recognition start error:', e);
  }
}

function stopListening() {
  recognition?.stop();
  setState('idle');
}

// ── Mic button ────────────────────────────────────────
micButton.addEventListener('click', () => {
  if (currentState === 'listening') stopListening();
  else startListening();
});

// ── Jarvisz toggle ────────────────────────────────────
jarviszToggle.addEventListener('click', () => {
  jarviszEnabled = !jarviszEnabled;
  jarviszToggle.classList.toggle('active', jarviszEnabled);
  jarviszLabel.textContent = jarviszEnabled ? '🧠 Jarvisz: ON' : '🧠 Jarvisz: OFF';

  if (!jarviszEnabled) {
    speechSynthesis.cancel();
    recognition?.stop();
    setState('idle');
  }
});

// ── Knowledge: cargar última decisión ────────────────
async function loadLastDecision() {
  const el = document.getElementById('lastDecision');
  if (!el) return;

  try {
    const res  = await fetch('http://localhost:3001/api/knowledge?project=Torre%20de%20control');
    const data = await res.json();

    if (!data.ok || !data.items.length) {
      el.textContent = 'No hay decisiones registradas.';
      return;
    }

    const item = data.items[data.items.length - 1];
    const { title, description } = item.currentVersion;

    el.innerHTML = '';
        const spanTopic = document.createElement('span');
            spanTopic.className = 'decision-topic';
                spanTopic.textContent = item.topic;
                    const strongTitle = document.createElement('strong');
                        strongTitle.className = 'decision-title';
                            strongTitle.textContent = title;
                                el.appendChild(spanTopic);
                                    el.appendChild(strongTitle);
                                        if (description) {
                                              const spanDesc = document.createElement('span');
                                                    spanDesc.className = 'decision-desc';
                                                          spanDesc.textContent = description;
                                                                el.appendChild(spanDesc);
                                                                    }
  } catch {
    el.textContent = 'No hay decisiones registradas.';
  }
}

loadLastDecision();

// ── Input: auto-resize + keyboard ────────────────────
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendButton.addEventListener('click', () => sendMessage());

// ── Browser panel ─────────────────────────────────────
const browserUrlInput = document.getElementById('browserUrlInput');
const browserFetchBtn = document.getElementById('browserFetchBtn');
const browserResult   = document.getElementById('browserResult');

async function fetchAndShowPage() {
  const url = browserUrlInput.value.trim();
  if (!url) return;

  browserFetchBtn.disabled = true;
  browserResult.textContent = '⏳ Leyendo página...';
  browserResult.className = 'browser-result';

  try {
    const res  = await fetch(BROWSE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();

    if (data.ok && data.text) {
      browserResult.textContent = data.text;
      browserResult.className = 'browser-result browser-result--ok';

      // Auto-fill chat input with URL so user can ask questions about the page
      chatInput.value = url + ' ';
      chatInput.focus();
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
    } else {
      browserResult.textContent = '⚠️ ' + (data.error ?? 'No se pudo leer la página.');
      browserResult.className = 'browser-result browser-result--error';
    }
  } catch {
    browserResult.textContent = '⚠️ No se pudo conectar con el backend.';
    browserResult.className = 'browser-result browser-result--error';
  }

  browserFetchBtn.disabled = false;
}

browserFetchBtn.addEventListener('click', fetchAndShowPage);

browserUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    fetchAndShowPage();
  }
});
