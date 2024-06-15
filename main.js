import { App } from "./src/js/app";
import './src/scss/global.scss';
import './src/sounds/sheep.mp3';
import './src/logos/logo-transparent.png';

if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/"})
        .then(() => console.log("service worker registered"))
        .catch((err) => console.log("service worker not registered", err))
}

window.customElements.define("app-component", App);
const root = document.querySelector("#app");
const app = document.createElement("app-component")
root.appendChild(app);