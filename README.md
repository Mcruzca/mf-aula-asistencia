# Asistencia en JavaScript puro
Sin dependencias ni compilación: no hace falta npm install.
npm start (o node serve.mjs 4303). Puerto 4303.
No tiene Angular. public/widget.js define una etiqueta HTML propia.
public/remoteEntry.json está escrito a mano: le dice al shell que ./Widget es widget.js.
Después de editar: recarga el shell; el servidor no guarda caché.

## Pieza que Asistencia comparte: lista de alumnos
Asistencia es la dueña de la lista de alumnos y la expone como ./ListaAlumnos (public/lista-alumnos.js).
El shell la carga una vez al arrancar; cualquier módulo, Angular o JavaScript, la muestra con la misma etiqueta.
Los datos salen de public/alumnos.json, que hace de API de ejemplo.

| Parte | Contrato |
|---|---|
| Etiqueta | `<aula-lista-alumnos>` |
| Atributo `grupo` | Filtra por grupo, por ejemplo `grupo="3A"`. Sin él muestra todos |
| Atributo `seleccionable` | Muestra cada alumno como botón |
| Propiedad `alumnos` | Opcional: si el módulo ya tiene los datos, se los pasa y la lista no los pide |
| Evento `aula-alumno-seleccionado` | `detail: { alumnoId, nombre, grupo }`. Sale del Shadow DOM (`composed: true`) |
| Variable CSS `--aula-lista-color` | Color del borde y los botones |

Reglas para darle mantenimiento:
- Al recargar, todos los módulos que la usan ven el cambio, sin recompilarlos.
- Se pueden mejorar estilos, textos y la lógica interna, y agregar atributos o eventos opcionales.
- No cambies ni quites la etiqueta, `grupo`, `seleccionable` ni el evento sin versionarlo: romperías a todos los módulos a la vez.
- Si este servidor está apagado, los demás módulos muestran el texto que pusieron dentro de la etiqueta.

Usarla en otro módulo:
- JavaScript: escribe la etiqueta en el HTML y escucha `aula-alumno-seleccionado`.
- Angular: agrega `schemas: [CUSTOM_ELEMENTS_SCHEMA]` al componente y usa `(aula-alumno-seleccionado)="..."`.
