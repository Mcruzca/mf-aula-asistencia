// JavaScript del navegador: sin imports de Angular.
class Asistencia extends HTMLElement {
 constructor() {
   super();
   this.attachShadow({ mode: 'open' }); // Encapsula HTML y estilos.
   this.cantidad = 0;
 }
 connectedCallback() { // Al insertar la etiqueta.
   this.control?.abort();
   this.control = new AbortController();
   this.shadowRoot.innerHTML = `
     <style>:host {display:block} section {border:2px solid #087f8c;padding:20px;border-radius:8px} button {padding:10px;cursor:pointer}</style>
     <section><small>JAVASCRIPT PURO · localhost:4303</small><h2>Asistencia al taller</h2>
     <p id="saludo"></p><button>Registrar una asistencia</button>
     <p aria-live="polite">Asistencias registradas: <span id="total">0</span></p></section>`;
   this.shadowRoot.querySelector('#saludo').textContent = 'Hola, ' + (this.getAttribute('participante') || 'participante');
   this.shadowRoot.querySelector('#total').textContent = String(this.cantidad);
   this.shadowRoot.querySelector('button').addEventListener('click', () => {
     this.cantidad++;
     this.shadowRoot.querySelector('#total').textContent = String(this.cantidad);
     this.dispatchEvent(new CustomEvent('aula-cambio', {
       detail: { message: 'Asistencias: ' + this.cantidad }, bubbles: true, composed: true
     }));
   }, { signal: this.control.signal });
 }
 disconnectedCallback() { this.control?.abort(); }
}
if (!customElements.get('aula-asistencia')) customElements.define('aula-asistencia', Asistencia);
