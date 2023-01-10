---
sidebar_position: 5
toc_max_heading_level: 2
---

# Searching

Hunch attempts to be a very comprehensive and powerful search engine.

The following are features are properties set on each search request, on the `query` property:

```js
import { hunch } from 'hunch'
const search = hunch({ index: { /* the loaded compiled index */ } })
const query = {
	q: 'search words',
	facetExclude: { tags: [ 'cats' ] }
}
const results = search(query)
```

In addition to a programmatic API, Hunch offers a canonical mapping of URL query parameters to Hunch search parameters. This is entirely optional, and is available as the `normalize` function, as in this equivalent search:

```js
import { hunch, normalize } from 'hunch'
const search = hunch({ index: { /* the loaded compiled index */ } })
const { searchParams } = new URL('https://site.com?q=search%20words&facets[tags]=-cats')
const query = normalize(searchParams)
const results = search(query)
```

Hunch supports the following features:

## Boost ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/boost)) {#boost}

Boost the ranking value of some metadata properties.

### Programmatic

- Name: `boost`
- Type: `Object<String,Number>` - The key is the metadata key, the number is the amount to boost.

Example:

```json
{ "boost": { "title": 2, "summary": 3 } }
```

### Query Parameter

- Name: `boost[$KEY]` - The `$KEY` is the metadata key to boost.
- Type: `String` - The number is the amount to boost. Converted to a number using `parseInt`.

Example:

```json
{ "boost[title]": "2", "boost[summary]": "3" }
```

------

## By ID ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/by-id)) {#by-id}

Fetch a single item by the `_id`, which is the filename.

:::info

All other search parameters are ignored when this one is set.

The output from Hunch is different for a request by ID (see the [search results](./results.md#by-id) docs for details).

:::

Example:

```json
{
	"item": {
		"_id": "posts/2023-01-03-cool-cats.md",
		"title": "My Cool Cats",
		"_chunks": [
			{ "content": "Many words about cats." }
		]
	}
}
```

### Programmatic

- Name: `id`
- Type: `String` - The identifier of the item to return.

Example:

```json
{ "id": "posts/2023-01-03-cool-cats.md" }
```

### Query Parameter

- Name: `id`
- Type: `String` - The identifier of the item to return.

```json
{ "id": "posts/2023-01-03-cool-cats.md" }
```

------

## Facet ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/facet)) {#facet}

Filter by content metadata values, e.g. filter by content containing a `tag` property with `cats` and not `dogs`.

### Programmatic

There are two properties, one for inclusive (the content must include it), the other for excluding (the content must *not* include it).

- Name: `facetInclude` and `facetExclude`
- Type: `Object<String,Array<String>>` - The key is the metadata key to filter by, the value is a list of metadata values.

Example:

```json
{
	"facetInclude": { "tags": [ "cats" ] },
	"facetExclude": { "tags": [ "dogs" ] }
}
```

### Query Parameter

The query parameter combines the two by using the `-` prefix as exclusive.

- Name: `facets[$KEY]` - The `$KEY` is the metadata key used to filter.
- Type: `String` - A comma seperated list of key values, where a `-` prefix indicates exclude that value.

Example:

```json
{ "facets[tags]": "cats,-dogs" }
```

---

## Full Text Lookup ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/full-text-lookup)) {#full-text-lookup}

Find records with the exact words.

### Query Parameter

- Name: `q`
- Type: `String`

Example:

```json
{ "q": "exact words" }
```

### Programmatic

Example:

- Name: `q`
- Type: `String`

Example:

```json
{ "q": "exact words" }
```

---

## Fuzzy Search ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/fuzzy-search)) {#fuzzy-search}

Specify a fuzziness to the text query, to find records with misspelled or similar words. The fuzziness value must be positive and greater than `0`.

E.g. to find `cats` and `kats` you might use `q=cats&fuzzy=0.8`

### Programmatic

- Name: `fuzzy`
- Type: `Float`

Example:

```json
{ "fuzzy": 0.8 }
```

### Query Parameter

- Name: `fuzzy`
- Type: `String` - Converted to a float using `parseFloat`.

Example:

```json
{ "fuzzy": "0.8" }
```

---

## Get Facets ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/get-facets)) {#get-facets}

Retrieve the full facets map by not setting a query parameter.

This effectively gives you the entire data set, so you'll get up to a full page of results back, with the facet map filled for all data.

You can specify the page size as `0` if you want *no* items returned, but this is not required.

### Programmatic

Example:

```json
{ "pageSize": 0 }
```

### Query Parameter

Example:

```json
{ "page[size]": 0 }
```

---

## Pagination ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/pagination)) {#pagination}

Specify how many results to return per query. Hunch uses a page size and offset:

- Size: the number of results to include. *Default: `15`*
- Offset: the number of pages to offset, as a zero-index. E.g. if there were 3 pages, the offsets would be 0, 1, and 2.

Specify how many results with `page[size]` and a pagination offset with `page[offset]`

### `maxPageSize`

To limit the maximum page size (e.g. to prevent `page[size]=Infinity` attacks) you can pass in a limit as `maxPageSize` on instantiation.

Default: `100`

```js
import { hunch } from 'hunch'
const search = hunch({
	index: { /* the loaded compiled index */ },
	maxPageSize: 25,
})
// ...
```

### Programmatic

- Name: `pageSize` and `pageOffset`
- Type: `Integer`

Example:

```json
{ "pageSize": 4, "pageOffset": 2 }
```

### Query Parameter

- Name: `page[size]` and `page[offset]`
- Type: `String` - Converted using `parseInt`

Example:

```json
{ "page[size]": "4", "page[offset]": "2" }
```

---

## Prefix ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/prefix)) {#prefix}

To find both `motorcycle` and `motocross` you might use `moto` as the query text, and specify it as a prefix.

> Note: this property applies to the *whole query*, e.g. `word1 word2` will look for `word1 word2*` not `word1*` and `word2*`.

### Programmatic

- Name: `prefix`
- Type: `Boolean` - Anything truthy will be interpreted as `true`, all other values as `false`.

Example:

```json
{ "prefix": true }
```

### Query Parameter

- Name: `prefix`
- Type: `String` - Must be exactly `true` or `false`.

Example:

```json
{ "prefix": "true" }
```

---

## Score ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/score)) {#score}

The search results include a ranking value named `_score`, which is the relevance that the search engine gives to each result.

---

## Snippet ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/snippet)) {#snippet}

Specify how much context to include around the found query text.

:::caution
In version `0.2` of Hunch, this implementation is not particularly context-aware: the number you provide is up to the number of characters at the search term to include, so it doesn't start or end at word boundaries. Future versions of Hunch are planned to be more context aware.
:::

:::info
To specify the main content field, use `content` as the metadata key.
:::

### Programmatic

- Name: `snippet`
- Type: `Object<String,Number>` - The key is the metadata key, the number is the maximum number of characters to include near the query term.

Example:

```json
{ "snippet": { "title": 50, "content": 120 } }
```

### Query Parameter

- Name: `snippet[$KEY]` - The `$KEY` is the metadata key.
- Type: `String` - The number is the maximum number of characters to include. Converted to a number using `parseInt`.

Example:

```json
{ "snippet[title]": "50", "snippet[content]": "120" }
```

---

## Sort ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/sort)) {#sort}

Specify a function when instantiating Hunch to sort search results prior to pagination and faceting.

The function is supplied with the complete list of search result items and the normalized query object, and should return the sorted list.

The query normalization function will pass along the value of `sort` unchanged. There is no type defined for it, it's up to you.

Example:

```js
import { hunch } from 'hunch'
const search = hunch({
	index: { /* the loaded compiled index */ },
	sort: ({ items, query }) => {
		return query.sort === 'date'
			? items.sort((a, b) => a.published - b.published)
			: items
	}
})
const query = {
	q: 'search words',
	sort: 'date',
}
const results = search(query)
```

---

## Specific Fields ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/specific-fields)) {#specific-fields}

Limit the text query to one or more metadata properties. (Hunch defaults to searching every field configured as searchable.)

:::caution
Specifying any field overrides the default entirely, which means you need to specify *all* fields if you specify *any*.
:::

:::info
To specify the main content field, use `content`.
:::

### Programmatic

- Name: `fields`
- Type: `Array<String>` - The list of metadata keys to search.

Example:

```json
{ "fields": [ "title", "summary" ] }
```

### Query Parameter

- Name: `fields`
- Type: `String` - Comma seperated list of metadata keys to search.

Example:

```json
{ "fields": "title,summary" }
```

---

## Suggest ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/suggest)) {#suggest}

Instead of search results, Hunch can give you back suggested search strings based on your indexed data.

For example, the query text `arch` might suggest `archery sport` and `march madness` as better search queries.

:::info
The output from Hunch is different for a suggestion (see the [search results](./results.md#suggestion) docs for details). The output looks like this:
:::

Example:

```json
{
	"suggestions": [
		{ "q": "archery sport", "score": 1.305 },
		{ "q": "march madness", "score": 0.073 }
	]
}
```

### Programmatic

- Name: `suggest`
- Type: `Boolean` - Anything truthy will be interpreted as `true`, all other values as `false`.

Example:

```json
{ "suggest": true }
```

### Query Parameter

- Name: `suggest`
- Type: `String` - Must be exactly `true` or `false`.

Example:

```json
{ "suggest": "true" }
```
