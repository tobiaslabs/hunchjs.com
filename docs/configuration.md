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

## `facets`

This property is responsible for generating search facets, it is a list of metadata keys.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	facets: [
		'categories',
		'series',
		'tags',
	]
}
```

## `formatBlock`

An optional asynchronous function which is given a [Blockdown](https://github.com/saibotsivad/blockdown) block, and returns a modified block. It is called with an object containing the following properties, copied from the Blockdown specifications:

* `name` <`String`> - The name of the block, e.g. for `---!yaml` this property would be `yaml`.
* `id` <`String`> - If present, the identifier for the block, e.g. for `---!yaml#abc` this property would be `abc`.
* `metadata` <`String`> - If present, the un-parsed metadata for the block, e.g. for `---!yaml[foo]` this property would be `foo`.
* `content` <`String`> - If present, the string content of the block. See the [Blockdown specs](https://blockdown.md/) for more details.

This function should return an object with the same key-value structure, although the `metadata` property may be reformatted.

Returning a falsey value will cause this block to be dropped from the searchable content.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	formatBlock: ({ name, id, metadata, content }) => {
		if (name !== 'markdown') return false
		metadata = your_custom_metadata_parser(metadata)
		content = your_custom_content_parser(content)
		return { name, id, metadata, content }
	}
}
```

## `glob`

This is the search string used to ingest files from the input folder.

Default: `**/*.md`

## `input`

The input directory to scan for files to ingest.

## `normalizeMetadata`

An optional function which is called during ingestion prior to filtering, it must return the modified object and may be synchronous or asynchronous. It is called with an object containing the following properties:

* `metadata` <`Object`> - The object resulting from parsing the frontmatter as YAML.
* `blocks` <`Array`<[`Block`][blockarray]>> - The pre-parsed content blocks, as [Blockdown](https://github.com/saibotsivad/blockdown) blocks. (Markdown sites commonly only have one content block.)

[blockarray]: https://github.com/saibotsivad/blockdown#blocks-arrayobject

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	normalizeMetadata: ({ metadata, blocks }) => {
		if (typeof metadata.tags === 'string') metadata.tags = metadata.tags.split(';')
		metadata.wordCount = yourWordCountAlgorithm(blocks)
		return metadata
	}
}
```

## `output`

The filepath of where to write the JSON file, e.g. `./dist/hunch.json`

## `preFilter`

An optional function to filter out files by filename, before they are read. Return truthy to include the file, or falsey to exclude.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	preFilter: filepath => !filepath.startsWith('draft/')
}
```

## `processedFilter`

An optional function to filter out files after they are fully read and processed. Return truthy to include the file, or falsey to exclude. Occurs *after* the `normalizeMetadata` function executes. May be asynchronous.

Default: excludes documents where `published` is exactly `false` or is a date that is in the future.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	processedFilter: ({ metadata }) => metadata.draft !== true
}
```

## `searchableFields`

A list of field names that should be searchable, that are not a facet.

This list will *always* include the Markdown file content blocks.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	searchableFields: [ 'description', 'summary' ]
}
```

## `stopWords` ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/stop-words)) {#stop-words}

Stop words are words that are "filtered out (i.e. stopped) before or after processing of text because they are insignificant" ([Wikipedia](https://en.wikipedia.org/wiki/Stop_word)).

Since stop words are entirely language and context dependent, HunchJS *does not* ship with any default stop words, but you instead supply them as an array of strings.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	stopWords: [ 'and', 'or', 'to', 'in', 'the' ],
}
```

## `storedFields` ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/stored-fields)) {#stored-fields}

A list of field names that are not searchable or faceted, but will be saved and returned with the search results.

By default Hunch will only store the facets and searchable fields. If you want additional metadata available on search results, you will need to specify it.

Example:

```js
// hunch.config.js
export default {
	// ... other options, then ...
	storedFields: [ 'published', 'podcastId' ]
}
```
