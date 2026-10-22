# Asistencia en JavaScript puro
Sin dependencias ni compilación: no hace falta npm install.
npm start (o node serve.mjs 4303). Puerto 4303.
No tiene Angular. public/widget.js define una etiqueta HTML propia.
public/remoteEntry.json está escrito a mano: le dice al shell que ./Widget es widget.js.
Después de editar: recarga el shell; el servidor no guarda caché.
