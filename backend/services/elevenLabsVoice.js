'use strict';

/**
 * elevenLabsVoice.js
 * Servicio de síntesis de voz via ElevenLabs API.
 * Expone synthesizeToBase64(text) -> string (base64)
 *
 * Variables de entorno requeridas:
 *   ELEVENLABS_API_KEY  — clave de la API de ElevenLabs
 *   ELEVENLABS_VOICE_ID — ID de la voz a usar (ej. voz tipo JARVIS)
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '';
const ELEVENLABS_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_turbo_v2_5';

/**
 * Verifica si el servicio está configurado.
 * @returns {boolean}
 */
function isConfigured() {
  return Boolean(ELEVENLABS_API_KEY && ELEVENLABS_VOICE_ID);
}

/**
 * Convierte texto a audio MP3 usando ElevenLabs Text-to-Speech API.
 * Retorna el audio como string base64.
 * @param {string} text — Texto a sintetizar
 * @returns {Promise<string>} Base64 del audio MP3, o string vacío si no está configurado o hay error
 */
async function synthesizeToBase64(text) {
  if (!isConfigured()) {
    console.warn('TTS: ELEVENLABS_API_KEY o ELEVENLABS_VOICE_ID no configurados. Retornando vacío.');
    return '';
  }

  if (!text || typeof text !== 'string') {
    console.warn('TTS: texto a sintetizar es inválido o está vacío.');
    return '';
  }

  try {
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
          similarity_boost: 0.85,
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
      console.warn(`TTS error ${response.status}: ${detail}`);
      return '';
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  } catch (error) {
    console.warn('TTS error:', error.message);
    return '';
  }
}

module.exports = { synthesizeToBase64, isConfigured };
