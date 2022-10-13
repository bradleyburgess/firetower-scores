import FiretowerScores from "./FiretowerScores/index.js";

(function () {
  if (window.customElements) {
    window.customElements.define("firetower-scores", FiretowerScores);
  }
})();
