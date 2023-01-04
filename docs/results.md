---
sidebar_position: 6
---

# Search Results

This page documents the output data in one of three formats: 1) by ID, 2) search results, or 3) suggestion request.

## By ID

The output from a by-ID request is an object with the following properties:

- `item` <[`HunchItem`](#hunchitem) | `null`> - The item, or `null` if not found.

:::info
For request results by ID, the `HunchItem` has `_chunks` set instead of `_chunk`.
:::

## Search

The output from a Hunch search is an object with the following properties:

- `facets` <[`HunchFacets`](#hunchfacets)>
- `item` <`Array`<[`HunchItem`](#hunchitem)>>
- `page` <[`HunchPagination`](#hunchpagination)>

## Suggestion

The output from a Hunch suggestion request is an object with the following properties:

- `suggestions` <`Array`<[`HunchSuggestion`](#hunchsuggestion)> - The list of suggestion objects.

Example:

```json
{
	"suggestions": [
		{ "q": "march madness", "score": 12.709 },
		{ "q": "marching shoes", "score": 5.324 }
	]
}
```

## Types

The object type definitions are as follows:

### `HunchChunk`

Each document (Markdown file) can be split into one or more "chunks". Each chunk has the following potential properties:

- `name` <`String`> - The name of the chunk, if named.
- `id` <`String`> - The identifier of the chunk, if an ID is set.
- `metadata` <`Any`> - If metadata is set on the chunk, it will be that value.
- `content` <`String`> - The text contents of the chunk.

:::info
The chunks are split using [Blockdown](https://github.com/saibotsivad/blockdown) syntax by default. See
the [configuration](./configuration.md) documentation for more details.
:::

### `HunchFacets`

This is a map of facet keys to a [`HunchFacetValues`](#hunchfacetvalues) map.

Example: this whole object is a `HunchFacets` object, containing two [`HunchFacetValues`](#hunchfacetvalues) objects.

```json
{
	"series": {
		"Animals": 6,
		"Book Reviews": 3
	},
	"tags": {
		"cats":  3,
		"dogs": 7
	}
}
```

### `HunchFacetValues`

This is a map of unique metadata values (converted to `String`s) from a facet key, to the number of documents containing this value across all paginated results.

Example:

```json
{
	"cats":  3,
	"dogs": 7
}
```

### `HunchItem`

This is an object representing the content document. It has the following properties:

- `_id` <`String`> - This is the filename, e.g. `posts/2022-12-29-cats-and-dogs.md`
- `_chunk` <[`HunchChunk`](#hunchchunk)> - *Only present for search results.* This is the most relevant `HunchChunk` for the provided search query.
- `_chunks` <`Array`<[`HunchChunk`](#hunchchunk)>> - *Only present for by-ID results.* This is the full list of `HunchChunk`s for the item.
- `_score` <`Float`> - The score of the search result, rounded to 3 decimal points, e.g. `0.158` for a weak relevance, or `127.300` for a high relevance.

In addition, any metadata specified as an aggregation or additional stored field will be present.

Example: from a search result.

```json
{
	"series": "Animals",
	"tags": [ "cats", "dogs" ],
	"title": "About Cats & Dogs",
	"_chunk": { "content": "Fancy words about cats and dogs." },
	"_id": "2022-12-29/cats-and-dogs.md",
	"_score": 0.1580
}
```

Example: from a by-ID request.

```json
{
	"series": "Animals",
	"tags": [ "cats", "dogs" ],
	"title": "About Cats & Dogs",
	"_chunks": [
		{ "content": "Fancy words about cats and dogs." }
	],
	"_id": "2022-12-29/cats-and-dogs.md",
	"_score": 0.1580
}
```

### `HunchPagination`

A simple object containing the pagination information. It has the following properties:

- `items` <`Integer`> - The total number of items found, outside of pagination.
- `offset` <`Integer`> - The zero-index pagination offset, e.g. from the search request.
- `pages` <`Integer`> - The total number of pages available.
- `size` <`Integer`> - The page size, either from the search request or the internal default.

Example:

```json
{
	"items": 137,
	"offset": 0,
	"pages": 6,
	"size": 25
}
```

### `HunchSuggestion`

An object containing a suggested search query and a relevance score. It has the following properties:

- `q: String` - The suggested query string.
- `score: Float` - The relevance score, rounded to 3 decimal places.

```json
{
	"q": "march madness",
	"score": 12.709
}
```
