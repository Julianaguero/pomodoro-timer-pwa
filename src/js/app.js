import { LitElement, html, css } from "lit";
import {
  TimerComponent,
  TimerPlayerComponent,
} from "@jnguero-utils/timer-component";
import { SoundComponent } from "@jnguero-utils/sound-component";

import sheepSound from "../sounds/sheep.mp3";
import timerLogo from "../logos/logo-transparent.png";

// Definir elementos personalizados si no están ya definidos
if (!customElements.get("timer-component")) {
  customElements.define("timer-component", TimerComponent);
}

if (!customElements.get("timer-player-component")) {
  customElements.define("timer-player-component", TimerPlayerComponent);
}

if (!customElements.get("sound-component")) {
  customElements.define("sound-component", SoundComponent);
}

// Componente principal de la aplicación
export class App extends LitElement {
  static properties = {
    timerValue: { type: Number, state: true },
    finishMessage: { type: String, state: true },
    showFinishMessage: { type: Boolean, state: true }, 
    _isPomodoro: { type: Boolean, state: true },
    _isTimer: { type: Boolean, state: true },
    _pomodoroTimer: { type: Object, state: true },
    _breakTimer: { type: Object, state: true },
  };

  constructor() {
    super();
    this.timerValue = 0;
    this.finishMessage = "Time's up!";
    this.showFinishMessage = true;
    this._isPomodoro = true;
    this._isTimer = false;
    this._pomodoroTimer = {
      value: 20,
      state: true,
      message: "Tomate un descanso!",
    };
    this._breakTimer = { value: 5, state: false, message: "Hora de seguir!" };
    this._countdownTimer = { value: 10, state: true, message: "Time's Up!" };
  }

  connectedCallback() {
    super.connectedCallback();
    this._setPomodoroTimer();
    this.addEventListener("isFinished", this._handleIsFinished);
    this.addEventListener("playEvent", this._playAction);
    this.addEventListener("pauseEvent", this._pauseAction);
    this.addEventListener("resetEvent", this._pauseAction);
  }

  disconnectedCallback() {
    this.removeEventListener("isFinished", this._handleIsFinished);
    this.disconnectedCallback();
  }

  firstUpdated() {
    this.spanContent = this.shadowRoot.querySelectorAll(".spanContent");
    this.buttons = this.shadowRoot.querySelectorAll("button");
    this._toggleSpanClasses();
    this._toggleButtonClasses();
  }

  updated(changedProperties) {
    if (
      changedProperties.has("_isPomodoro") ||
      changedProperties.has("_isTimer")
    ) {
      this._updateSpanContent();
    }
  }

  _setMode(e) {
    const mode = e.target.dataset.mode;
    this._isPomodoro = mode === "pomodoro";
    this._isTimer = mode === "timer";

    this.showFinishMessage = false; 

    this._isTimer ? this._setCountDownTimer() : this._setPomodoroTimer();

    this._toggleButtonClasses();
    this._toggleSpanClasses();
    this.requestUpdate();
  }

  _toggleButtonClasses() {
    if (this.buttons) {
      this.buttons.forEach((button) => {
        const mode = button.dataset.mode;
        if (
          (this._isPomodoro && mode === "pomodoro") ||
          (this._isTimer && mode === "timer")
        ) {
          button.classList.add("focused");
        } else {
          button.classList.remove("focused");
        }
      });
    }
  }

  _toggleSpanClasses() {
    if (this._isPomodoro && this.spanContent) {
      this.spanContent.forEach((span) => {
        const isPomodoroSpan = span.classList.contains(
          "pomodoro__content-primary"
        );
        if (
          (this._pomodoroTimer.state && isPomodoroSpan) ||
          (this._breakTimer.state && !isPomodoroSpan)
        ) {
          span.classList.add("focused");
        } else {
          span.classList.remove("focused");
        }
      });
    }
  }

  _updateSpanContent() {
    this.spanContent = this.shadowRoot.querySelectorAll(".spanContent");
    this._toggleSpanClasses();
  }

  _handleChangeValue(e) {
    const input = e.target;
    const newValue = input.value;

    // Verificar si el valor cumple con el patrón de números enteros positivos
    const isValid = /^[0-9]+$/.test(newValue);

    if (isValid) {
      input.setCustomValidity("");
      const id = e.target.id;

      const timerMap = {
        "pomodoro-input": "_pomodoroTimer",
        "break-input": "_breakTimer",
        "countdown-input": "_countdownTimer"
      };

      if (this._isPomodoro && timerMap[id]) {
        this[timerMap[id]] = { ...this[timerMap[id]], value: Number(newValue) };
        this._setPomodoroTimer();
      } else if (this._isTimer && id === "countdown-input") {
        this._countdownTimer = { ...this._countdownTimer, value: Number(newValue) };
        this._setCountDownTimer();
      }
    } else {
      // Si no es válido, muestra un mensaje de error personalizado
      input.setCustomValidity("Por favor, ingresa un número entero positivo.");
    }

    // Actualiza la validación
    input.reportValidity();
  }


  _handleIsFinished(e) {
    if (this._isPomodoro) {
      if (this._pomodoroTimer.state) {
        this._pomodoroTimer = { ...this._pomodoroTimer, state: false };
        this._breakTimer = { ...this._breakTimer, state: true };
      } else {
        this._pomodoroTimer = { ...this._pomodoroTimer, state: true };
        this._breakTimer = { ...this._breakTimer, state: false };
      }
      this._setPomodoroTimer();
    }
    this.showFinishMessage = true;  
    e.stopPropagation();
    this.requestUpdate();
  }

  _setPomodoroTimer() {
    this.timerValue = this._pomodoroTimer.state
      ? this._pomodoroTimer.value * 60
      : this._breakTimer.value * 60; // agregar el * 60 para convertirlo en minutos
    this.finishMessage = this._pomodoroTimer.state
      ? this._breakTimer.message
      : this._pomodoroTimer.message;

    this._toggleSpanClasses();
  }

  _restartTimers() {
    if (this._isPomodoro) {
      this.timerValue = 20 * 60;
    } else {
      this.timerValue = 10;
    }
  }

  _setCountDownTimer() {
    this.timerValue = this._countdownTimer.value;
    this.finishMessage = this._countdownTimer.message;
  }

  _playAction(e) {
    const input = this.shadowRoot.querySelectorAll("input");
    input.forEach((input) => {
      input.disabled = true;
    });

    e.stopPropagation();
  }

  _pauseAction(e) {
    const input = this.shadowRoot.querySelectorAll("input");
    input.forEach((input) => {
      input.disabled = false;
    });

    e.stopPropagation();
  }
  // HTML ELEMENTS
  _buttonElement(mode, textContent) {
    return html`<button
      class="primary-button"
      data-mode="${mode}"
      @click="${this._setMode}"
    >
      ${textContent}
    </button>`;
  }

  _pomodoroTimerWrapper(mode, spanClass, text, inputId, value, time) {
    return html`
      <div class="${mode}-container">
        <span class="spanContent ${spanClass}">${text}</span>
        <div class="input-container">
          <input
            id="${inputId}"
            type="number"
            min="0"
            .value="${value}"
            @input="${this._handleChangeValue}"
            pattern="^[0-9]*$"
            required
          />
          <small>${time}</small>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="img-container">
        <img src="${timerLogo}" alt="Timer PWA logo" />
      </div>
      <div id="timer">
        <div>
          <div class="wrapper">
            ${this._buttonElement("pomodoro", "Pomodoro")}
            ${this._buttonElement("timer", "Timer")}
          </div>
          ${this._isPomodoro
            ? html`<div class="wrapper pomodoro-wrapper">
                ${this._pomodoroTimerWrapper(
                  "pomodoro",
                  "pomodoro__content-primary",
                  "Pomodoro",
                  "pomodoro-input",
                  this._pomodoroTimer.value,
                  "min"
                )}
                ${this._pomodoroTimerWrapper(
                  "pomodoro",
                  "pomodoro__content-secondary",
                  "Descanso",
                  "break-input",
                  this._breakTimer.value,
                  "min"
                )}
              </div>`
            : html`
                <div class="wrapper timer-wrapper">
                  ${this._pomodoroTimerWrapper(
                    "timer",
                    "pomodoro__content-primary focused",
                    "Cuenta atrás",
                    "countdown-input",
                    this._countdownTimer.value,
                    "sec"
                  )}
                </div>
              `}
        </div>

        <timer-player-component
          pause-btn
          play-btn
          reset-btn
          finish-message="${this.showFinishMessage ? this.finishMessage : ''}"
        >
          <timer-component
            start="${this.timerValue}"
            reverse
          ></timer-component>
          <sound-component src="${sheepSound}"></sound-component>
        </timer-player-component>
      </div>
    `;
  }

  static styles = css`
    :host {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      font-family: "VR_Standard", serif;
    }

    button {
      font-size: 1rem;
      width: 8rem;
      height: 2.4rem;
      cursor: pointer;
    }

    .img-container {
      margin: 0 auto;
      max-width: 300px;
      overflow: hidden;
    }

    img {
      height: 200px;
      object-fit: center;
    }

    #timer {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 0 auto;
      color: var(--neutral-light-color);
      background-color: var(--primary-lightest-color);
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.6);
      padding: 1rem 2rem 2.5rem;
    }

    .wrapper {
      margin: 2rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
    }

    .pomodoro-wrapper {
      margin-bottom: 2rem;
      gap: 4rem;
    }

    .timer-wrapper {
      padding: 1rem 0 0.5rem;
    }

    .timer-container {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .pomodoro-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .pomodoro__content-primary.focused {
      color: #59335c;
      font-weight: 700;
    }

    .pomodoro__content-secondary.focused {
      color: #448340;
      font-weight: 700;
    }

    .input-container {
      position: relative;
    }

    input {
      width: 6rem;
      display: inline-block;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      text-align: center;
      border: none;
      border-bottom: 1px solid var(--neutral-dark-color, black);
      color: var(--neutral-light-color, gray);
      font-family: var(--timer-component-font-family);
      padding: 3px 0 0 0;
      font-weight: 600;
      font-size: 1rem;
    }

    .input-container small {
      position: absolute;
      right: 1.1rem;
      bottom: 0.1rem;
    }

    #countdown-input {
      width: 7rem;
      text-align: center;
    }

    .primary-button {
      border-radius: 5px;
      border: var(--neutral-light-color, gray) solid 2px;
      background-color: transparent;
      color: var(--neutral-light-color, gray);
      transition: all 100ms ease-in;
    }

    .primary-button:hover {
      background-color: var(--neutral-lightest-color, #454545);
      color: var(--primary-lightest-color, white);
    }

    .primary-button.focused {
      background-color: var(--neutral-color, #454545);
      border: var(--neutral-color, #454545) solid 2px;
      color: var(--primary-lightest-color, white);
    }
    .primary-button:hover.focused {
      background-color: var(--neutral-color, #454545);
      border: var(--neutral-color, #454545) solid 2px;
      color: var(--primary-lightest-color, white);
    }

    button:active {
      transform: scale(0.95);
    }

    timer-player-component {
      --timer-component-font-family: "VR_Standard", serif;
      --timer-component-part-color: var(--neutral-color);
      --timer-component-part-padding: 15px 10px 10px 10px;
      --timer-component-part-box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.5);
      --timer-component-part-border-radius: 5px;
      --timer-component-part-font-size: 1.9rem;
      --timer-component-part-width: 2.3rem;
      --timer-component-join-padding: 10px;
      --timer-component-join-font-size: 1.2rem;
      --timer-player-component-color: var(--neutral-light-color);
      --timer-player-component-part-color: var(---primary-lightest-color);
      --timer-player-component-button-padding: 7px 35px;
      --timer-player-component-button-margin: 0 auto;
      --timer-player-component-button-border-radius: 5px;
      --timer-player-component-button-border: none;
      --timer-player-component-button-font-size: 1.1rem;
      --timer-player-component-button-font-weight: 500;
      --timer-player-component-play-color: var(--primary-lightest-color);
      --timer-player-component-play-background-color: var(--primary-color);
      --timer-player-component-action-margin: 2rem 0 0 0;
      --timer-player-component-status-color: var(--info-color);
      --timer-player-component-status-font-size: 1.5rem;
      --timer-player-component-status-margin: 0 0 20px 0;
    }

    @media (max-width: 750px) {
      .input-container small {
        right: 0.9rem;
      }
    }
  `;
}
