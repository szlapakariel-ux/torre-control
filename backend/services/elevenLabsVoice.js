'use strict';

/**
 * elevenLabsVoice.js
 * Servicio de síntesis de voz via ElevenLabs API.
 * Expone synthesize(text) -> Buffer (audio/mpeg)
 *
 * Variables de entorno requeridas:
 *   ELEVENLABS_API_KEY  — clave de la API de ElevenLabs
 *   ELEVENLABS_VOICE_ID — ID de la voz a usar (ej. voz tipo JARVIS)
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '';
const ELEVENLABS_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';

/**
 * Verifica si el servicio está configurado.
 * @returns {boolean}
 */
function isConfigured() {
  return Boolean(ELEVENLABS_API_KEY && ELEVENLABS_VOICE_ID);
}

/**
 * Convierte texto a audio MP3 usando ElevenLabs Text-to-Speech API.
 * @param {string} text — Texto a sintetizar (máx. 500 chars recomendado)
 * @returns {Promise<Buffer>} Buffer con el audio en formato MP3
 */
async function synthesize(text) {
  if (!isConfigured()) {
    throw new Error(
                          'ElevenLabs no configurado. Definí ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID en las variables de entorno.'
                        );
  }

  if (!text || typeof text !== 'string') {
    throw new Error('El texto a sintetizar es inválido o está vacío.');
  }

  const trimmed = text.trim().slice(0, 2500);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

  const response = await fetch(url, {
                                      method: 'POST',
                                      headers: {
                                        'xi-api-key': ELEVENLABS_API_KEY,
                                        'Content-Type': 'application/json',
                                        'Accept': 'audio/mpeg',
                                      },
                                      body: JSON.stringify({
                                                                 text: trimmed,
                                                                 model_id: ELEVENLABS_MODEL,
                                                                 voice_settings: {
                                                                   stability: 0.5,
                                                                   similarity_boost: 0.75,
                                                                   style: 0.0,
                                                                   use_speaker_boost: true,
                                                                 },
                                                               }),
                                    });

  if (!response.ok) {
    let detail = '';
    try {
      const err = await response.json();
      detail = err?.detail?.message || JSON.stringify(err);
    } catch (_) {
      detail = await response.text();
    }
    throw new Error(`ElevenLabs API error ${response.status}: ${detail}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = { synthesize, isConfigured };
