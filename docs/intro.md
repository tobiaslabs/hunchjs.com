---
sidebar_position: 1
---

# HunchJS Intro

Let's discover **HunchJS in less than 5 minutes**.

## Getting Started

Walk through this tutorial to add HunchJS to an 11ty site that deploys to Cloudflare Pages.

## What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above

## Configure and compile the search index

Once configured, use HunchJS to compile the contents to a search index.

```bash
hunch
# shorthand for
hunch --config hunch.config.js
```

This generates a JSON file containing the search index.

## Query the search index

The environment you use will determine the specifics of loading the index (a plain JavaScript/JSON object), but querying will look the same:

```js
import { hunch } from 'hunch'
const index = { /* the loaded index */ }
const search = hunch({ index })
const results = search({ q: 'all your base' })
```

## Local development

Use the `--watch` flag to rebuild the index when your content files change.

Use the `--serve` (or `--serve 3030` for a custom port) to launch a simple HTTP server that uses the canonical (but optional!) query parameters.
