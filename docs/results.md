---
sidebar_position: 6
---

# Search Results

This page documents the output data from a search or suggestion request.

## Search

The output from a Hunch search is an object with the following properties:

- `items: Array<HunchSearchResult>`
- `page: HunchPagination`
- `aggregation: HunchAggregationMap`

These types are as follows:

### HunchSearchResult

This is an object representing the content document. It has the following properties:

- `_id: String` - This is the filename, e.g. `posts/2022-12-29-cats-and-dogs.md`
- `_content: String` - This is the actual contents of the file.

In addition, any metadata specified as an aggregation or additional stored field will be present.

Example:

```json
{
	"title": "About Cats & Dogs",
	"tags": [ "cats", "dogs" ],
	"series": "Animals",
	"_id": "2022-12-29/cats-and-dogs.md",
	"_content": "Fancy words about cats and dogs."
}
```

### HunchPagination

A simple object containing the pagination information. It has the following properties:

- `number: Integer` - The zero-index pagination offset.
- `size: Integer` - The maximum number of items that will be returned in a page.
- `total: Integer` - The total number of pages available.

Example:

```json
{
	"number": 0,
	"size": 5,
	"total": 3
}
```

### HunchAggregationMap

This is a map of aggregation keys to `HunchAggregation` objects, e.g.:

```
{
	series: {...},
	tags: {...},
}
```

### HunchAggregation

An object representing the aggregation details in the search results. The available properties are:

- `title: String` - If a `title` is specified in the aggregation configuration.
- `buckets: Array<HunchAggregationBucket>` - A list of `0` or more buckets, for the query results across all paginated pages.

Example:

```
{
	"title": "Tags",
	"buckets": [ ... ]
}
```

### HunchAggregationBucket

An object containing information about a search results aggregations. The available properties are:

- `key: any` - The bucket key, which is the metadata value. E.g. if the metadata `tags` has `[ "cats" ]` this value would be the string `"cats"`, but if it had `count: 3` this value would be the number `3`.
- `count: Integer` - The number of documents across paginated results containing this aggregation value.

Example:

```json
{
	"key": "cats",
	"count": 5
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
- `score: Float` - The relevance score.
