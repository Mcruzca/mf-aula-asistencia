// Pieza de Asistencia para otros módulos: cualquiera (Angular o JavaScript) la muestra con una etiqueta.
// Contrato: <aula-lista-alumnos grupo="3A" seleccionable>, propiedad alumnos y evento aula-alumno-seleccionado.
// No conoce a quien la usa: recibe todo por atributos y avisa con eventos.
const DATOS = new URL('./alumnos.json', import.meta.url); // En un sistema real: GET /api/alumnos.

class ListaAlumnos extends HTMLElement {
 static observedAttributes = ['grupo', 'seleccionable'];
 constructor() {
   super();
   this.attachShadow({ mode: 'open' }); // Sus estilos no afectan al módulo que la usa, ni al revés.
   this.todos = [];
 }
 connectedCallback() { this.cargar(); }
 disconnectedCallback() { this.control?.abort(); }
 attributeChangedCallback() { if (this.isConnected) this.pintar(); }

 // Opcional: quien la usa puede darle los datos ya listos y la lista no los pide.
 set alumnos(lista) { this.externos = lista; if (this.isConnected) this.pintar(); }
 get alumnos() { return this.externos ?? this.todos; }

 async cargar() {
   if (this.externos) { this.pintar(); return; }
   this.control?.abort();
   this.control = new AbortController();
   this.mostrar('Cargando alumnos…');
   try {
     const respuesta = await fetch(DATOS, { signal: this.control.signal });
     if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
     this.todos = await respuesta.json();
     this.pintar();
   } catch (error) {
     if (this.control.signal.aborted) return;
     console.error(error);
     this.mostrar('No se pudo cargar la lista de alumnos.');
   }
 }

 mostrar(texto) {
   this.shadowRoot.innerHTML = ESTILOS + '<section><p></p></section>';
   this.shadowRoot.querySelector('p').textContent = texto;
 }

 pintar() {
   const grupo = this.getAttribute('grupo');
   const seleccionable = this.hasAttribute('seleccionable');
   const alumnos = this.alumnos.filter(a => !grupo || a.grupo === grupo);
   this.shadowRoot.innerHTML = ESTILOS + `<section><small>PIEZA DE ASISTENCIA · localhost:4303</small>
     <h3></h3><ul></ul></section>`;
   this.shadowRoot.querySelector('h3').textContent = 'Alumnos' + (grupo ? ' · grupo ' + grupo : '') + ' (' + alumnos.length + ')';
   const lista = this.shadowRoot.querySelector('ul');
   if (!alumnos.length) { lista.innerHTML = '<li>Sin alumnos.</li>'; return; }
   lista.replaceChildren(...alumnos.map(alumno => {
     const item = document.createElement('li');
     if (!seleccionable) { item.textContent = alumno.nombre; return item; }
     const boton = document.createElement('button');
     boton.type = 'button';
     boton.textContent = alumno.nombre;
     boton.setAttribute('aria-pressed', String(alumno.id === this.elegido));
     boton.addEventListener('click', () => {
       this.elegido = alumno.id;
       this.pintar();
       // Avisa al módulo que la contiene. composed: true para salir del Shadow DOM.
       this.dispatchEvent(new CustomEvent('aula-alumno-seleccionado', {
         detail: { alumnoId: alumno.id, nombre: alumno.nombre, grupo: alumno.grupo }, bubbles: true, composed: true
       }));
     });
     item.append(boton);
     return item;
   }));
 }
}

// --aula-lista-color permite que cada módulo cambie el color sin tocar esta pieza.
const ESTILOS = `<style>
 :host {display:block;margin:12px 0}
 section {border:2px dashed var(--aula-lista-color, #6d28d9);border-radius:8px;padding:12px 16px;background:#faf5ff}
 small {color:var(--aula-lista-color, #6d28d9);font-weight:600}
 h3 {margin:6px 0}
 ul {margin:0;padding-left:20px}
 li {margin:4px 0}
 button {padding:4px 10px;cursor:pointer;border:1px solid var(--aula-lista-color, #6d28d9);border-radius:6px;background:white}
 button[aria-pressed="true"] {background:var(--aula-lista-color, #6d28d9);color:white}
</style>`;

if (!customElements.get('aula-lista-alumnos')) customElements.define('aula-lista-alumnos', ListaAlumnos);
