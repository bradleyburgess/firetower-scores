import { circumference, colors } from "./constants.js";

/*
 *   CONTENTS:
 *     - calculateDashArray
 *     - getColorClass
 *     - getScoreText
 *     - handleIntersection
 *     - makeStyleTextContent
 *     - validateScore
 */

export function calculateDashArray(score, rounded = false) {
  let dash = score * circumference;
  if (rounded && score < 1) dash -= 7;
  const gap = circumference - dash;
  return `${dash} ${gap}`;
}

export function getColorClass(score) {
  if (score < 0.5) return "fail";
  if (score < 0.9) return "average";
  return "pass";
}

export function getScoreText(score) {
  if (score == 1) return "100";
  let number = score;
  number = Math.floor(number * 100) / 100;
  return `0${number * 100}`.slice(-2);
}

export function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.shadowRoot
        .querySelector(".animated")
        .classList.add("visible");
      observer.disconnect();
    }
  });
}

export const makeStyleTextContent = (_this) => `.wrapper {
  display: grid;
  grid-template-areas: 'middle';
  place-items: center center;
  position: relative;
  height: calc(3 * var(--lhc-size, 1.25em));
  width: calc(3 * var(--lhc-size, 1.25em));
}

svg {
  grid-area: middle;
}

.circle-bg {
  opacity: 0.1;
}

.circle-bg.pass {
  fill: var(--lhc-color-pass, ${colors.green.normal});
  stroke: var(--lhc-color-pass, ${colors.green.normal});
}
.circle-bg.average {
  fill: var(--lhc-color-average, ${colors.orange.normal});
  stroke: var(--lhc-color-average, ${colors.orange.normal});
}
.circle-bg.fail {
  fill: var(--lhc-color-fail, ${colors.red.normal});
  stroke: var(--lhc-color-fail, ${colors.red.normal});
}

.circle-fg {
  fill: none;
  transform: rotate(-90deg);
  transform-origin: center;
  stroke-linecap: var(--lhc-stroke-linecap, butt);
}

.animated .circle-fg {
  stroke-dasharray: 0 352;
}

.animated.visible .circle-fg {
  stroke-dasharray: ${calculateDashArray(_this.score, _this.rounded)};
  animation: var(--lhc-animation-duration, 0.8s) var(--lhc-animation-timing, ease) lh-animation forwards;
}

.circle-fg.pass {
  stroke: var(--lhc-color-pass, ${colors.green.normal});
}
.circle-fg.average {
  stroke: var(--lhc-color-average, ${colors.orange.normal});
}
.circle-fg.fail {
  stroke: var(--lhc-color-fail, ${colors.red.normal});
}

.text {
  font-family: var(--lhc-font, monospace);
  grid-area: middle;
  font-size: var(--lhc-size, 1.25em);
}

.text.pass {
  color: var(--lhc-color-pass-secondary, ${colors.green.secondary});
}
.text.average {
  color: var(--lhc-color-average-secondary, ${colors.orange.secondary});
}
.text.fail {
  color: var(--lhc-color-fail-secondary, ${colors.red.secondary});
}

@keyframes lh-animation {
  from { stroke-dasharray: 0 352; }
}`;

export function validateScore(score) {
  score = parseFloat(score);
  if (!score) return false;
  if (typeof score !== "number") return false;
  if (score < 0 || score > 1) return false;
  return true;
}
