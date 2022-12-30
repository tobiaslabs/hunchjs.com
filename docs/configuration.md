---
sidebar_position: 4
---

# Configuration

When run from the command line, Hunch looks for a file `hunch.config.js` by default, but use `-c` or `--config` to specify a different file.

```bash
hunch
# which is the same as
hunch --config hunch.config.js
# use different file
hunch -c hunch-alt.config.js
```

The available configuration properties are:

#### `aggregations`

This property is responsible for generating search facets, it is a dictionary of keys to objects containing these properties:

- `title` - The human-readable name.
- `size` - The number of items to return for this aggregation. (Default: 10)
- `conjunction` - By default, a search with multiple inclusive facets specified will create an `AND` query. By setting this value to `false`, it becomes an `OR` query. You'll probably want to set it to `false` for things like tags/categories.

Note that `aggregations` is passed in to ItemsJS without modification, so you can read [the ItemsJS docs](https://github.com/itemsapi/itemsjs#api) for additional details.

#### `glob`

This is the search string used to ingest files from the input folder.

Default: `**/*.md`

#### `input`

The input directory to scan for files to ingest.

#### `normalizeMetadata`

An optional function which is called during ingestion prior to filtering. It is given the document metadata object, and should return the modified object.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	normalizeMetadata: metadata => {
		if (typeof metadata.tags === 'string') metadata.tags = metadata.tags.split(';')
		return metadata
	}
}
```

#### `output`

The filepath of where to write the JSON file, e.g. `./dist/hunch.json`

#### `preFilter`

An optional function to filter out files by filename, before they are read. Return truthy to include the file, or falsey to exclude.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	preFilter: filepath => !filepath.startsWith('draft/')
}
```

#### `processedFilter`

An optional function to filter out files after they are fully read and processed. Return truthy to include the file, or falsey to exclude. (Occurs *after* the `normalizeMetadata` function executes.)

Default: excludes documents where `published` is exactly `false` or is a date that is in the future.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	processedFilter: ({ metadata }) => metadata.draft !== true
}
```

#### `searchableFields`

A list of field names that should be searchable, that are not an aggregate facet.

This list will *always* include the field names from `aggregations`, as well as `_content`.
