/**
 * Copyright 2025 PlayGamesMakeGames
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) { //I18 stands for internationalization

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.count = 0;
    this.min = 0;
    this.max = 22; //arbitrary initial vals
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"], //locations for different languages
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      count: {type: Number, reflect: true},
      min: {type: Number, relfect: true},
      max: {type: Number, relfect: true},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      /* change color of number based on hard coded value*/
      /* [] are an attribute selector */
      :host([count="18"]) .counter{
        color: var(--ddd-theme-default-athertonViolet);
      }
      :host([count="21"]) .counter{
        color: var(--ddd-theme-default-beaverBlue);
      }
      .min-reached{
        color: var(--ddd-theme-default-limestoneGray);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
      }
      .counter{
        font-size: 64px;
        /* border: 8 8 8 8; */
        /* padding: 16px; */
        /* need to make counter center on page automatically ASK IN CLASS */
        margin-left: 32px;
        margin-right: 64px auto;
      }
      button{
        border-radius: 4px;
        background-color: var(--ddd-theme-default-accent);
        font-size: 24px;
        margin: 8px;
      }
      /* Button colors */
      .minusOne:hover{
        background-color: var(--ddd-theme-default-original87Pink);
      }
      .plusOne:hover{
        background-color: var(--ddd-theme-default-forestGreen);
      }
      .minusOne:focus{
        background-color: var(--ddd-theme-default-error);
      }
      .plusOne:focus{
        background-color: var(--ddd-theme-default-success);
      }
      
    `];
  }
  decrease(){
    if(this.count > this.min){
      this.count--;
      // console.log("minused one");
    }
    if(this.count === this.min){
      this.shadowRoot.querySelector(".counter").classList.add("min-reached");
      // console.log("min reached added class reached");
    } else {
      this.shadowRoot.querySelector(".counter").classList.remove("min-reached");
    }
  }
  increase(){
    if(this.count < this.max){
      this.count++;
    }
    if(this.count === this.max){
      this.shadowRoot.querySelector(".counter").classList.add("min-reached");
      // console.log("min reached class reached");
    } else {
      this.shadowRoot.querySelector(".counter").classList.remove("min-reached");
    }
  }
  
  // As soon as component exists (onawake method)
  firstUpdated(changedProperties){
    super.updated(changedProperties);
    if(this.count == this.min || this.count == this.max){
      this.shadowRoot.querySelector(".counter").classList.add("min-reached");
    }
  }
  
updated(changedProperties) {
  if (super.updated) {
    super.updated(changedProperties);
  }
  if (changedProperties.has('count')) {
    // do your testing of the value and make it rain by calling makeItRain
    console.log("count change to: ", this.count);
    if(this.count === 21){
      this.makeItRain();
    }
  }
}

makeItRain() {
  // this is called a dynamic import. It means it won't import the code for confetti until this method is called
  // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
  // will only run AFTER the code is imported and available to us
  import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
    (module) => {
      // This is a minor timing 'hack'. We know the code library above will import prior to this running
      // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
      // this "hack" ensures the element has had time to process in the DOM so that when we set popped
      // it's listening for changes so it can react
      setTimeout(() => {
        // forcibly set the popped attribute on something with id confetti
        // while I've said in general NOT to do this, the confetti container element will reset this
        // after the animation runs so it's a simple way to generate the effect over and over again
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    }
  );
}

  // Lit render the HTML
  render() {
    return html`
<confetti-container id="confetti" class="wrapper">
  <div class="counter">${this.count}</div>
  <div class="buttons">
    <button class="minusOne" @click=${this.decrease} ?disabled="${this.min === this.counter}">-1</button>
    <button class="plusOne" @click=${this.increase} ?disabled="${this.max === this.counter}">+1</button>
  </div>
  </confetti-container>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);