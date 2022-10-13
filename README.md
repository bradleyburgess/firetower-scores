# Firetower Scores

A Web Component for displaying Firetower (Google Lighthouse) scores.

This component is part of the Firetower Project, which consists of: 

- an API server (coming soon)
- an uploader client (coming soon)
- a web component for displaying Lighthouse scores (← you are here)

For more information, see [the Firetower Project docs](#).

## Installation

There are two options for installing the Firetower Scores component:

- CDN / script tag
- NPM

### CDN / script tag

Simply put this in your `<head>`:

```html
<script src="https://unpkg.com/firetower-scores/dist/fts.min.js" defer></script>
```

The script will download the module and register the custom element, requiring
no further steps.

### NPM

For more control, you can download the module with NPM.

First install:

```bash
npm i firetower-scores
```

Then import:

```js
// You can just import the auto-initializing script:
import "firetower-scores/dist/fts.min.js";

// Or you can import the component and manually define:
import { FiretowerScores } from "firetower-scores";
if (window.customElement) {
  window.customElements.define("firetower-scores", FiretowerScores);
}

// Or perhaps you want to dynamically import?
document.addEventListener("some-event" async () => {
  const { FiretowerScores } = await import("firetower-scores");
  window.customElements.define("firetower-scores", FiretowerScores):
  // ...
});
```

## Usage

After you've downloaded and/or installed the component as above, you simply use
the `<firetower-scores>` element in your html markup. There are three modes for
getting scores data:

1. `raw-only`: Manually provide the raw scores via a prop (comma-separated list)
2. `api-only`: Get scores from the Firetower api (coming soon)
3. `fallback`: Get scores from the api, and provide `raw-scores` as fallback (coming soon)

### Basic example: raw scores

Currently, this is the only supported source. (API coming soon)

Simply provide a comma-separated list of the scores, in 0-1 decimal.

```html
<firetower-scores raw-scores="1, 0.99, 0.97, 0.45"></firetower-scores>
<!-- The space in the scores list is optional -->
<!-- See below for customization -->
```

The order for `raw-scores` is the same as for Lighthouse results:

1. performance
2. a11y
3. best-practices
4. seo
5. (pwa)

### Exclude Categories

By default, `pwa` is excluded. You can override this using the
`exclude-categories` prop, which is also a comma-separated list.

```html
<firetower-scores 
  raw-scores="1, 0.99, 0.97"
  exclude-categories="seo,pwa"
></firetower-scores>

<!-- Or to enable all scores: -->
<firetower-scores 
  raw-scores="1, 0.99, 0.97, 0.98, 1"
  exclude-categories="none"
></firetower-scores>
```

There will be an error if there is a mismatch between the number of scores
provided and the number of scores expected (i.e. not excluded).


### LighthouseCircle

If you're interested in just the circle gauge part of the component, that can be
imported standalone:

```js
import { LighthouseCircle } from "firetower-scores";
window.customElements.define("lighthouse-circle", LighthouseCircle);

// or
import "firetower-scores/dist/lhc.min.js";
```

The `lighthouse-circle` component takes `animated`, `rounded` and `score`
(required) as props.

## Customization

There are several options available for customization, either via a prop or via
a CSS custom property.

### Props

| Prop name  | Effect              | Default       | Allowed value(s)          |
|------------|---------------------|---------------|---------------------------|
| `animated` | animates gauges     | off           | flag (empty, or omit)     |
| `rounded`  | rounds gauge stroke | off           | flag (empty, or omit)     |
| `variant`  | sets variant        | `scores-only` | `scores-only` or `labels` |

```html
<firetower-scores 
  raw-scores="..."
  rounded
  animated
  variant="labels"
></firetower-scores>
```

### CSS Custom Properties

The variable names below are pretty self-explanatory. For reference, this is the
DOM structure of the `firetower-scores` and `lighthouse-circle` components:

```
firetower-scores
    div.ft-container            (--firetower-container-*)
        div.ft-item             (--firetower-item-*)
            lighthouse-circle   (--lhc-*)
                div.wrapper
                    svg
                        circle
                        circle
                    span.text
            div.label           (--firetower-label-*)
        
```

| CSS Variable Name                 | Default              | Notes                                 |
|-----------------------------------|----------------------|---------------------------------------|
| `--firetower-base-size`           | `0.75rem`            | controls label font size              |
| `--firetower-container-gap`       | `base-size` or `1em` | … in that order                       |
| `--firetower-container-justify`   | `center`             | ---                                   |
| `--firetower-container-margin`    | `0`                  | ---                                   |
| `--firetower-container-max-width` | `100%`               | ---                                   |
| `--firetower-container-min-width` | ---                  | ---                                   |
| `--firetower-container-padding`   | `0`                  | ---                                   |
| `--firetower-container-width`     | ---                  | prefer min- or max-width              |
| `--firetower-label-color`         | `inherit`            | ---                                   |
| `--firetower-label-font-weight`   | `400`                | ---                                   |
| `--firetower-label-font`          | `inherit`            | ---                                   |
| `--firetower-label-margin-top`    | `1em`                | ---                                   |
| `--lhc-animation-duration`        | `0.8s`               | ---                                   |
| `--lhc-animation-timing`          | `ease`               | ---                                   |
| `--lhc-color-pass`                | `#0c6`               | pass gauge fg and bg                  |
| `--lhc-color-pass-secondary`      | `#080`               | pass text color                       |
| `--lhc-color-average`             | `#fa3`               | average gauge fg and bg               |
| `--lhc-color-average-secondary`   | `#c33300`            | average text color                    |
| `--lhc-color-fail`                | `#f33`               | fail gauge fg and bg                  |
| `--lhc-color-fail-secondary`      | `#c00`               | fail text color                       |
| `--lhc-font`                      | `monospace`          | font for score                        |
| `--lhc-size`                      | `1.25em`             | height and width calculated from this |
| `--lhc-stroke-linecap`            | `butt`               | controls rounded gauge                |
