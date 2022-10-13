import LighthouseCircle from "../LighthouseCircle/index.js";
import { categoriesTextMap } from "./constants.js";
import {
  makeArray,
  makeCategoriesList,
  makeStyleTextContent,
  validateExcludeCategoriesArray,
  validateRawScores,
  validateRawScoresAndExcludesLength,
  validateSources,
  validateVariant,
} from "./helpers";

/*
 *   TODO:
 *     BASIC
 *         [x] basic functionality: displaying four scores via raw data
 *         [x] custom styling
 *     CUSTOMIZING
 *         [ ] custom "Updated on" text
 *         [ ] custom label text
 *     API
 *         [ ] API, with fallback for raw scores, with validation
 *         [ ] more info available on firetower
 *         [ ] "Updated on ..."
 *     VARIANT
 *         [x] labels
 *         [ ] labels ????
 */

/*
 *  CSS custom properties:
 *      [x] --firetower-base-size
 *      [x] --firetower-container-gap
 *      [x] --firetower-container-justify
 *      [x] --firetower-container-margin
 *      [x] --firetower-container-max-width
 *      [x] --firetower-container-min-width
 *      [x] --firetower-container-padding
 *      [x] --firetower-container-width
 *      [x] (--firetower-item-min-width)
 *      [x] --firetower-label-color
 *      [x] --firetower-label-font
 *      [x] --firetower-label-font-weight
 *      [x] --firetower-label-margin-top
 */

/*
 *
 * Example usage:
 *   <firetower-scores
 *      firetower-endpoint="..."  AND
 *      site-id="..."
 *         OR site-url="..."
 *      AND/OR
 *      raw-scores="0.98,..."            # used for fallback
 *
 *         optionally:
 *      exclude-categories="performance, a11y, best-practices, seo, pwa, none" # default: "pwa"
 *      container-styles="valid css string"
 *      variant="scores-only | labels | table"
 */

export default class FiretowerScores extends HTMLElement {
  constructor() {
    super();
    if (
      window.customElements &&
      !window.customElements.get("lighthouse-circle")
    ) {
      window.customElements.define("lighthouse-circle", LighthouseCircle);
    }
  }

  render() {
    const shadowRoot = this.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    const container = document.createElement("div");

    container.classList.add("ft-container");
    if (this.containerStyles) container.style = this.containerStyles;
    style.textContent = makeStyleTextContent();

    const ftItems = [];
    for (let i = 0; i < this.scores.length; i++) {
      const categoryTitle = categoriesTextMap[this.scores[i].category];
      const scoreAriaLabel = `Lighthouse Score for ${categoryTitle}`;

      const ftItem = document.createElement("div");
      ftItem.classList.add("ft-item");
      ftItem.setAttribute("title", categoryTitle);
      ftItem.setAttribute("aria-label", scoreAriaLabel);

      const lhc = new LighthouseCircle();
      lhc.setAttribute("score", this.scores[i].score);
      if (this.rounded) lhc.setAttribute("rounded", "");
      if (this.animated) lhc.setAttribute("animated", "");
      if (this.size) lhc.setAttribute("size", this.size);

      ftItem.appendChild(lhc);

      if (this.variant === "labels") {
        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = categoryTitle;
        ftItem.append(label);
      }

      container.appendChild(ftItem);
      ftItems.push(ftItem);
    }

    shadowRoot.append(style, container);

    // normalize the item widths by setting min-width CSS custom property
    const biggestWidth = Math.max(...ftItems.map((item) => item.offsetWidth));
    container.style.setProperty(
      "--firetower-item-min-width",
      biggestWidth + "px"
    );
  }

  connectedCallback() {
    // this.firetowerEndpoint = this.getAttribute("firetower-endpoint") ?? null;
    // this.siteId = this.getAttribute("site-id") ?? null;
    // this.siteUrl = this.getAttribute("site-url") ?? null;
    this.firetowerEndpoint = null;
    this.siteId = null;
    this.siteUrl = null;
    this.variant = this.getAttribute("variant") ?? "scores-only";
    this.animated = this.hasAttribute("animated");
    this.rounded = this.hasAttribute("rounded");
    this.size = this.getAttribute("size") ?? undefined;
    this.containerStyles = this.getAttribute("container-styles") ?? null;

    const rawScores = this.getAttribute("raw-scores") ?? null;
    const excludeCategories = (
      this.getAttribute("exclude-categories") ?? "pwa"
    ).toLowerCase();

    validateRawScores(rawScores);
    validateExcludeCategoriesArray(excludeCategories);
    validateRawScoresAndExcludesLength(rawScores, excludeCategories);
    validateSources(this.siteUrl, this.siteId, rawScores);
    validateVariant(this.variant);

    this.scores = makeCategoriesList(excludeCategories);

    this.mode =
      (this.siteUrl || this.siteId) && rawScores
        ? "fallback"
        : !rawScores
        ? "api-only"
        : "raw-only";

    if (this.mode === "raw-only") {
      const rawScoresArray = makeArray(rawScores);
      for (let i = 0; i < rawScoresArray.length; i++) {
        this.scores[i].score = rawScoresArray[i];
      }
    }

    this.render();
  }
}
