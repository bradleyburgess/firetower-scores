import LighthouseCircle from "./LighthouseCircle/index.js";

(function () {
  if (window.customElements) {
    customElements.define("lighthouse-circle", LighthouseCircle);
  }
})();
