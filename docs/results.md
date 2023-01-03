---
sidebar_position: 6
---

# Search Results

This page documents the output data from a search or suggestion request.

## Search

The output from a Hunch search is an object with the following properties:

- `items: Array<HunchSearchResult>`
- `facets: HunchFacetsMap`
- `page: HunchPagination`

These types are as follows:

### HunchSearchResult

This is an object representing the content document. It has the following properties:

- `_content: String` - This is the actual contents of the file.
- `_id: String` - This is the filename, e.g. `posts/2022-12-29-cats-and-dogs.md`
- `_score: Float` - The score of the search result, rounded to 3 decimal points, e.g. `0.158` for a weak relevance, or `127.300` for a high relevance.

In addition, any metadata specified as an aggregation or additional stored field will be present.

Example:

```json
{
	"series": "Animals",
	"tags": [ "cats", "dogs" ],
	"title": "About Cats & Dogs",
	"_content": "Fancy words about cats and dogs.",
	"_id": "2022-12-29/cats-and-dogs.md",
	"_score": 0.1580
}
```

### HunchPagination

A simple object containing the pagination information. It has the following properties:

- `items: Integer` - The total number of items found, outside of pagination.
- `offset: Integer` - The zero-index pagination offset, e.g. from the search request.
- `pages: Integer` - The total number of pages available.
- `size: Integer` - The page size, either from the search request or the internal default.

Example:

```json
{
	"offset": 0,
	"size": 5,
	"total": 3
}
```

### HunchFacetsMap

This is a map of facet keys to a list of `HunchFacet` objects, e.g.:

```
{
	series: [...],
	tags: [...],
}
```

### HunchFacet

An object representing the facet item details from the search results. The available properties are:

- `key: String` - The unique metadata value of the facet key, e.g. for a `tags` facet, a `key` might be `"cats"`.
- `count: Integer` - The number of documents containing this value.

Example:

```json
{
	"key": "cats",
	"count": 3
}
```

```json
{
	"key": 3,
	"count": 2
}
```

## Suggestion

The output from a Hunch suggestion request is an object with the following properties:

- `suggestions: Array<HunchSuggestion>` - The list of suggestion objects.

Example:

```
{
	"suggestions": [ ... ]
}
```

### HunchSuggestion

An object containing a suggested search query and a relevance score. It has the following properties:

- `q: String` - The suggested query string.
- `score: Float` - The relevance score, rounded to 3 decimal places.
