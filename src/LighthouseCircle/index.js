import {
  calculateDashArray,
  getColorClass,
  getScoreText,
  handleIntersection,
  makeStyleTextContent,
  validateScore,
} from "./helpers.js";

/*
 *   Props
 *       - rounded        flag
 *       - animated       flag
 *       - score          float 0 - 1
 *       - root-margin    CSS px value
 *       - size           valid CSS unit
 */

/*
 *   CSS Custom Properties:
 *       --lhc-animation-duration
 *       --lhc-animation-timing
 *       --lhc-color-[pass | average | fail]
 *             --> circle bg (with opacity)
 *             --> circle gauge color
 *       --lhc-color-[pass | average | fail]-secondary
 *             --> score text color
 *       --lhc-font
 *       --lhc-size
 *       --lhc-stroke-linecap
 */

export default class LighthouseCircle extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const colorClass = getColorClass(this.score);

    // style tag
    const style = document.createElement("style");
    style.textContent = makeStyleTextContent(this);

    // wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    if (this.animated) wrapper.classList.add("animated");

    // svg and circles
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 120 120");

    const circleBg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleBg.classList.add("circle-bg", colorClass);
    circleBg.setAttribute("r", "56");
    circleBg.setAttribute("cy", "60");
    circleBg.setAttribute("cx", "60");
    circleBg.setAttribute("stroke-width", "8");

    const circleFg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleFg.classList.add("circle-fg", colorClass);
    circleFg.setAttribute("r", "56");
    circleFg.setAttribute("cy", "60");
    circleFg.setAttribute("cx", "60");
    circleFg.setAttribute("stroke-width", "8");
    if (!this.animated) {
      circleFg.style["stroke-dasharray"] = calculateDashArray(
        this.score,
        this.rounded
      );
    }

    // handle props
    if (this.size) {
      wrapper.style.setProperty("--lhc-size", this.size);
    }
    if (this.rounded) {
      wrapper.style.setProperty("--lhc-stroke-linecap", "round");
    }
    if (this.animated) {
      const rootMargin = this.getAttribute("root-margin") ?? "-35px";
      new IntersectionObserver(handleIntersection, {
        rootMargin,
      }).observe(this);
    }

    // score text
    const text = document.createElement("span");
    text.classList.add("text", colorClass);
    text.textContent = getScoreText(this.score);

    // append all the things
    svg.append(circleBg, circleFg);
    wrapper.append(svg, text);
    shadowRoot.append(style, wrapper);
  }

  connectedCallback() {
    this.score = this.getAttribute("score");
    if (!validateScore(this.score))
      throw new Error("Invalid score provided: " + this.score);
    this.rounded =
      this.hasAttribute("rounded") ||
      getComputedStyle(this)
        .getPropertyValue("--lhc-stroke-linecap")
        .includes("round");
    this.animated = this.hasAttribute("animated");
    this.size = this.getAttribute("size") ?? null;
    this.render();
  }
}
