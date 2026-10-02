GUÍA DE ENTREVISTA FRONTEND / MOBILE
======================================

Uso rápido
----------
1. Descomprime la carpeta.
2. Abre index.html con Chrome, Edge, Firefox o Safari.
3. La app ya incluye el temario actual.
4. Puedes buscar, filtrar, marcar favoritos y expandir respuestas.

Actualizar el temario
---------------------
La forma más cómoda de trabajar con ChatGPT es:
- Seguir haciendo consultas normalmente.
- Pedir: "Agrégalo al temario y expórtame un JSON actualizado".
- Descargar el nuevo JSON.
- En la app pulsar "Cargar JSON" y seleccionar el archivo.

El JSON cargado queda guardado en localStorage de ese navegador.
No es necesario editar index.html, app.js ni styles.css cuando crezca la base.

Archivos
--------
index.html        Interfaz principal.
styles.css        Estilos.
app.js            Búsqueda, filtros, favoritos, importación/exportación y persistencia.
temario.json      Fuente de datos editable/importable.
temario-data.js   Copia del temario inicial para que index.html funcione incluso abierto con file://.

Formato mínimo de un elemento
-----------------------------
{
  "id": "un-id-unico",
  "category": "Ionic",
  "priority": "alta",
  "type": "pregunta",
  "question": "Pregunta o concepto",
  "expected": "Qué debería contener una buena respuesta",
  "basic": "Ejemplo de respuesta demasiado básica",
  "followups": ["Repregunta 1"],
  "terms": [
    { "term": "Término", "definition": "Explicación breve" }
  ],
  "tags": ["tag1", "tag2"]
}

Notas
-----
- La app no necesita servidor ni instalación.
- Para compartir tu base actual con otra persona, usa "Exportar JSON".
- Si borras el almacenamiento del navegador, se pierde la base personalizada y los favoritos,
  pero siempre puedes volver a cargar el JSON.
