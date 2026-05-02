# Checklist de merge — Torre de Control

> **Quién la define:** GPT (rol orquestador-auditor de Torre).
> **Cuándo se aplica:** ANTES de autorizar cualquier merge dentro del sistema Torre de Control, en cualquier repo activo.
> **Para qué:** que cualquier ejecutor (Claude, Codex, Claude Code, GPT-MCP) pueda chequear los mismos criterios y abortar consistentemente si algo no cumple.

---

## 1. Identidad del microciclo

- [ ] El microciclo tiene un solo objetivo.
- [ ] El objetivo está escrito y entendido.
- [ ] No mezcla diagnóstico, pedido, revisión, implementación y cierre en el mismo paso.
- [ ] No intenta "aprovechar" para arreglar otra cosa.
- [ ] Está claro si el microciclo es:
  - documental
  - diagnóstico read-only
  - técnico
  - producción / deploy
  - reglas activas

## 2. Repo correcto

- [ ] Está declarado el repo activo.
- [ ] Está declarado si hay repo solo lectura.
- [ ] El PR pertenece al repo correcto.
- [ ] No hay cambios cruzados entre repos.
- [ ] Si hay dos repos abiertos, solo uno tiene escritura.
- [ ] `torre-control` no fue tocado salvo que ese sea el repo activo.
- [ ] `auditoria-sofse` no fue tocado salvo que ese sea el repo activo.

## 3. Rama correcta

- [ ] La rama origen es la esperada.
- [ ] La rama destino es la esperada.
- [ ] La rama parte de master actualizado o de la base autorizada.
- [ ] No hay commits inesperados.
- [ ] No hay ramas encadenadas sin autorización.
- [ ] No hay cambios heredados de otro microciclo.

## 4. Estado del PR

- [ ] El PR existe.
- [ ] El PR está abierto.
- [ ] El PR no está mergeado.
- [ ] El PR no está cerrado.
- [ ] El PR no es draft, salvo que se haya aceptado expresamente.
- [ ] El PR está mergeable.
- [ ] No hay conflictos.
- [ ] No hay checks fallidos si existieran checks.
- [ ] No hay comentarios/reviews bloqueantes pendientes.

## 5. Diff exacto

- [ ] Se revisó la lista exacta de archivos modificados.
- [ ] El número de archivos coincide con el alcance autorizado.
- [ ] Cada archivo modificado está permitido.
- [ ] No aparece ningún archivo extra.
- [ ] No hay cambios ocultos o laterales.
- [ ] No hay eliminaciones inesperadas.
- [ ] No hay renombres inesperados.
- [ ] No hay cambios de formato masivos no pedidos.
- [ ] No hay modificaciones por tooling automático fuera de alcance.

## 6. Alcance documental (si aplica)

Para PR documental:

- [ ] Solo toca `.mesa/` o el archivo documental autorizado.
- [ ] No toca código.
- [ ] No toca runtime.
- [ ] No toca frontend.
- [ ] No toca backend.
- [ ] No toca reglas activas.
- [ ] No toca producción.
- [ ] No toca secrets.
- [ ] No toca workflows.
- [ ] No toca configuración de deploy.
- [ ] No crea implementación disfrazada de documentación.
- [ ] El documento creado corresponde al tipo correcto:
  - `.mesa/pedidos/` para órdenes
  - `.mesa/revisiones/` para diagnósticos, revisiones o cierres
  - `.mesa/estado.md` solo si el microciclo autoriza estado

## 7. Archivos prohibidos

Antes de mergear, confirmar que NO se tocó ninguno de estos, salvo autorización explícita:

- [ ] `app.py`
- [ ] `validador_mensajes.py`
- [ ] `gestor_tandas.py`
- [ ] `email_sender.py`
- [ ] scraping
- [ ] frontend
- [ ] backend runtime
- [ ] reglas activas
- [ ] `configs/reglas_manifest.json`
- [ ] archivos de configuración de Render
- [ ] variables de entorno
- [ ] secrets
- [ ] `.github/`
- [ ] workflows / CI
- [ ] producción
- [ ] archivos de otro repo
- [ ] `.mesa/estado.md`, si no estaba autorizado
- [ ] README de `.mesa/pedidos/` o `.mesa/revisiones/`, si no estaban autorizados

## 8. Reglas de seguridad

- [ ] No se toca producción sin autorización explícita.
- [ ] No se toca código si falta diagnóstico.
- [ ] No se automatiza si no fue probado.
- [ ] No se agregan agentes si falta protocolo.
- [ ] No se sube de nivel si el ciclo anterior no está cerrado.
- [ ] No se corrige runtime desde un diagnóstico documental.
- [ ] No se transforma una observación en implementación sin pedido formal.
- [ ] No se crean variantes operativas por analogía.
- [ ] No se activan reglas nuevas sin aprobación documental previa.

## 9. Consistencia con la Torre

- [ ] El PR respeta el mantra: **Estabilizar → cerrar → medir → subir un nivel**.
- [ ] El PR deja evidencia verificable.
- [ ] El PR reduce el rol de Ariel como cartero.
- [ ] La información importante queda en GitHub, no solo en chat.
- [ ] El cierre queda trazable por PR, commit o archivo `.mesa/`.
- [ ] El próximo paso queda claro.
- [ ] No deja decisiones críticas flotando.

## 10. Validación del contenido

- [ ] El contenido del archivo coincide con el objetivo.
- [ ] No contradice diagnósticos previos.
- [ ] No autoriza algo que el microciclo no permite.
- [ ] No mezcla "pedido" con "implementación".
- [ ] No mezcla "diagnóstico" con "fix".
- [ ] No declara cerrado algo que no fue probado.
- [ ] No oculta riesgos.
- [ ] No exagera el alcance real.
- [ ] Si hay brechas, quedan marcadas como brechas, no como resueltas.
- [ ] Si hay próximos pasos, quedan como próximos pasos, no como acciones ejecutadas.

## 11. Confirmación anti-cartero

- [ ] El agente productor dejó evidencia en el repo o PR.
- [ ] La Torre puede verificar sin depender de memoria de Ariel.
- [ ] Ariel no tiene que copiar contenido largo entre agentes.
- [ ] Si Claude/Codex no tiene acceso, no se fuerza a Ariel a hacer de terminal humano.
- [ ] Si la Torre tiene conector GitHub, puede verificar directamente.
- [ ] Si no hay acceso real, se declara bloqueo.

## 12. Gate final antes de merge

- [ ] PR correcto.
- [ ] Rama correcta.
- [ ] Base correcta.
- [ ] Head correcto.
- [ ] Diff correcto.
- [ ] Archivo o archivos exactos.
- [ ] Sin archivos extra.
- [ ] Sin código no autorizado.
- [ ] Sin producción.
- [ ] Sin secrets.
- [ ] Sin workflows.
- [ ] Sin runtime no autorizado.
- [ ] Sin repo cruzado.
- [ ] `mergeable: true`.
- [ ] Método de merge definido.
- [ ] Commit message coherente.
- [ ] No hay razón para bloquear.

## 13. Método de merge

- [ ] El método recomendado es **squash merge**.
- [ ] El título del commit resume el microciclo.
- [ ] El mensaje del commit enumera archivo incorporado.
- [ ] El mensaje del commit deja explícito lo que NO se tocó.
- [ ] No se usa merge commit salvo necesidad explícita.
- [ ] No se usa rebase merge salvo autorización específica.

## 14. Verificación post-merge

Después del merge, confirmar:

- [ ] PR quedó cerrado.
- [ ] PR quedó mergeado.
- [ ] Commit de merge existe en master.
- [ ] El SHA del commit queda registrado.
- [ ] El archivo o archivos incorporados son los esperados.
- [ ] No entró ningún archivo extra.
- [ ] No se tocó código si era documental.
- [ ] No se tocó producción.
- [ ] No se tocaron secrets.
- [ ] No se tocaron workflows.
- [ ] El estado final de master queda claro.
- [ ] El próximo paso queda definido, pero no ejecutado automáticamente si es otro microciclo.

## 15. Criterio de bloqueo

Se **bloquea el merge** si aparece cualquiera de estos casos:

- [ ] Archivo no autorizado.
- [ ] Cambio de código no autorizado.
- [ ] Cambio en producción.
- [ ] Cambio en secrets.
- [ ] Cambio en workflows.
- [ ] Cambio en reglas activas no autorizado.
- [ ] Cambio en repo equivocado.
- [ ] Más de un objetivo en el mismo PR.
- [ ] Diagnóstico mezclado con implementación.
- [ ] Pedido mezclado con fix técnico.
- [ ] PR no mergeable.
- [ ] Conflictos.
- [ ] Checks fallidos.
- [ ] Estado del PR dudoso.
- [ ] Evidencia insuficiente.
- [ ] El agente no pudo verificar y está suponiendo.
- [ ] El contenido contradice una decisión previa.
- [ ] El cambio obliga a Ariel a actuar como cartero.
