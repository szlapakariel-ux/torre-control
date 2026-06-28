# CHECKLIST_VOZ_JARVISZ — Integración ElevenLabs en Torre de Control

> Voz sintetizada tipo JARVIS para respuestas del sistema.
> Variables requeridas en Railway: `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`

---

## Paso 1 — Agregar dependencia `elevenlabs` al package.json

Actualizar `backend/package.json` agregando:
```json
"elevenlabs": "^0.17.0"
```

## Paso 2 — Crear servicio `backend/services/elevenLabsVoice.js`

Módulo que expone `synthesize(text)` → devuelve un `Buffer` con el audio MP3.
Usa `ELEVENLABS_API_KEY` y `ELEVENLABS_VOICE_ID` del entorno.
Si faltan las variables, lanza error descriptivo.

## Paso 3 — Agregar endpoint `POST /api/voz` en `backend/server.js`

- Recibe `{ text: string }` en el body (máx. 500 chars)
- Requiere autenticación (`requireAuth`)
- Llama a `synthesize(text)` del servicio ElevenLabs
- Devuelve el audio como `audio/mpeg` con header `Content-Type: audio/mpeg`

## Paso 4 — Agregar endpoint `GET /api/voz/status` en `backend/server.js`

- Sin autenticación (solo lectura)
- Devuelve `{ ok: true, configured: bool }` según si las variables están seteadas

## Paso 5 — Actualizar `.env.example` con las nuevas variables

Agregar al final del archivo:
```
# API de ElevenLabs para síntesis de voz tipo JARVIS.
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

## Paso 6 — Configurar variables en Railway

En el dashboard de Railway → proyecto Torre → Variables:
- `ELEVENLABS_API_KEY` = tu clave de ElevenLabs
- `ELEVENLABS_VOICE_ID` = ID de la voz (ej. JARVIS-like)

## Paso 7 — Hacer deploy en Railway

Verificar que el deploy se completa sin errores.
Confirmar en los logs que el servidor arranca con las nuevas rutas `/api/voz`.

## Paso 8 — Probar endpoint de status

```bash
curl https://<tu-dominio-railway>/api/voz/status
# Esperado: {"ok":true,"configured":true}
```

## Paso 9 — Probar síntesis de voz

```bash
curl -X POST https://<tu-dominio-railway>/api/voz \
  -H "Authorization: Bearer <API_TOKEN>" \
    -H "Content-Type: application/json" \
      -d '{"text":"Torre operativa. Sistema de voz activo."}' \
        --output test_voz.mp3
        # Verificar que test_voz.mp3 tiene audio válido
        ```

        ---

        ## Estado

        - [ ] Paso 1 — Dependencia agregada
        - [ ] Paso 2 — Servicio `elevenLabsVoice.js` creado
        - [ ] Paso 3 — Endpoint `POST /api/voz` activo
        - [ ] Paso 4 — Endpoint `GET /api/voz/status` activo
        - [ ] Paso 5 — `.env.example` actualizado
        - [ ] Paso 6 — Variables configuradas en Railway
        - [ ] Paso 7 — Deploy exitoso
        - [ ] Paso 8 — Status OK confirmado
        - [ ] Paso 9 — Audio generado y reproducible
