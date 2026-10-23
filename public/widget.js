// JavaScript del navegador: sin imports de Angular.
class Asistencia extends HTMLElement {
 constructor() {
   super();
   this.attachShadow({ mode: 'open' }); // Encapsula HTML y estilos.
   this.presentes = new Map(); // alumnoId → nombre
 }
 connectedCallback() { // Al insertar la etiqueta.
   this.control?.abort();
   this.control = new AbortController();
   // aula-lista-alumnos es la pieza que este módulo comparte (lista-alumnos.js); aquí se usa igual que en los demás.
   this.shadowRoot.innerHTML = `
     <style>:host {display:block} section {border:2px solid #087f8c;padding:20px;border-radius:8px}</style>
     <section><small>JAVASCRIPT PURO · repositorio mf-aula-asistencia</small><h2>Asistencia al taller</h2>
     <p id="saludo"></p><p>Marca a los alumnos presentes:</p>
     <aula-lista-alumnos grupo="3A" seleccionable style="--aula-lista-color:#087f8c">Lista de alumnos no disponible.</aula-lista-alumnos>
     <p aria-live="polite">Asistencias registradas: <span id="total">0</span> <span id="nombres"></span></p></section>`;
   this.shadowRoot.querySelector('#saludo').textContent = 'Hola, ' + (this.getAttribute('participante') || 'participante');
   this.pintar();
   // La lista avisa qué alumno se eligió; Asistencia decide qué hacer con eso.
   this.shadowRoot.addEventListener('aula-alumno-seleccionado', event => {
     const { alumnoId, nombre } = event.detail;
     this.presentes.set(alumnoId, nombre);
     this.pintar();
     this.dispatchEvent(new CustomEvent('aula-cambio', {
       detail: { message: 'Presente: ' + nombre + ' (' + this.presentes.size + ' en total)' }, bubbles: true, composed: true
     }));
   }, { signal: this.control.signal });
 }
 disconnectedCallback() { this.control?.abort(); }
 pintar() {
   this.shadowRoot.querySelector('#total').textContent = String(this.presentes.size);
   this.shadowRoot.querySelector('#nombres').textContent = this.presentes.size ? '· ' + [...this.presentes.values()].join(', ') : '';
 }
}
if (!customElements.get('aula-asistencia')) customElements.define('aula-asistencia', Asistencia);
