import { validCategories, validVariants } from "./constants.js";

/*
 *   CONTENTS:
 *     - makeArray
 *     - makeCategoriesList
 *     - makeStyleTextContent
 *     - validateExcludeCategoriesArray
 *     - validateRawScores
 *     - validateRawScoresAndExcludesLength
 *     - validateSources
 *     - validateVariant
 */

export function makeArray(input) {
  if (Array.isArray(input)) return input;
  return input?.split(",")?.map((item) => item.toLowerCase().trim()) ?? [];
}

export function makeCategoriesList(excludeCategories = "pwa") {
  // null, "", "none", list comma-separated need to be validated
  const inputArray =
    excludeCategories === "" || excludeCategories === "none"
      ? []
      : makeArray(excludeCategories);
  const outputArray = validCategories.filter(
    (item) => !inputArray.includes(item)
  );
  return outputArray.map((item) => ({
    category: item,
    score: undefined,
  }));
}

export const makeStyleTextContent = () => `:host {
  min-width: var(--firetower-container-min-width);
  max-width: var(--firetower-container-max-width, 100%);
  width: var(--firetower-container-width);
}
.ft-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: var(--firetower-container-justify, center);
  gap: var(--firetower-container-gap, var(--firetower-base-size, 1em));
  min-width: var(--firetower-container-min-width);
  max-width: var(--firetower-container-max-width, 100%);
  width: var(--firetower-container-width);
  margin: var(--firetower-container-margin, 0);
  padding: var(--firetower-container-padding, 0);
  font-size: var(--firetower-base-size, 0.75rem);
}
.ft-item {
  display: grid;
  place-items: center;
  min-width: var(--firetower-item-min-width, auto);
  font-size: inherit;
}
.label {
  margin-top: var(--firetower-label-margin-top, 1em);
  color: var(--firetower-label-color, inherit);
  font-family: var(--firetower-label-font, inherit);
  font-weight: var(--firetower-label-font-weight, 400);
  text-align: center;
}`;

export function validateExcludeCategoriesArray(input) {
  if (input === "" || input === null || (Array.isArray(input) && !input.length))
    return true;
  const inputArray = makeArray(input);
  const isValid =
    inputArray.every((elem) => validCategories.includes(elem)) ||
    input === "none";
  if (!isValid)
    throw new Error("Invalid value supplied for `exclude-categories`");
  return true;
}

export function validateRawScores(input) {
  if (input === "" || input === null || (Array.isArray(input) && !input.length))
    return true;
  const inputArray = makeArray(input).map((item) => parseFloat(item));
  const isValid =
    inputArray.every((item) => !isNaN(item) && item >= 0 && item <= 1) &&
    inputArray.length >= 0 &&
    inputArray.length <= validCategories.length;
  if (!isValid) throw new Error("Invalid value supplied for `raw-scores`");
  return true;
}

export function validateRawScoresAndExcludesLength(
  rawScores,
  excludeCategories
) {
  const rawScoresArray = makeArray(rawScores);
  const excludeCategoriesArray = makeArray(excludeCategories);
  const includeCategoriesArray = validCategories.filter(
    (item) => !excludeCategoriesArray.includes(item)
  );
  const isValid = rawScoresArray.length === includeCategoriesArray.length;
  if (!isValid)
    throw new Error(
      `Mismatched length between \`raw-scores\` and \`exclude-categories\``
    );
  return true;
}

export function validateSources(siteUrl, siteId, rawScores) {
  if (!siteUrl && !siteId && !rawScores)
    throw new Error("Site Url, Site ID, or raw scores required");
  return true;
}

export function validateVariant(input) {
  if (!validVariants.includes(input))
    throw new Error("Invalid value supplied for `variant`");
  return true;
}

// function validateFiretowerEndpoint() {}
