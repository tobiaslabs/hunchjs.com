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
const { searchParams } = new URL('https://site.com?q=search%20words&facet[tags]=-cats')
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

- Name: `facet[$KEY]` - The `$KEY` is the metadata key used to filter.
- Type: `String` - A comma seperated list of key values, where a `-` prefix indicates exclude that value.

Example:

```json
{ "facet[tags]": "cats,-dogs" }
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

## Metadata Sort ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/metadata-sort)) {#metadata-sort}

Return results sorted by one or more metadata properties instead of the search score.

### Programmatic

- Name: `sort`
- Type: `Array<String>` - The metadata key names used to sort.

Example:

```json
{ "sort": [ "tag", "series" ] }
```

### Query Parameter

- Name: `sort`
- Type: `String` - Comma seperated list of keys.

```json
{ "sort": "tag,series" }
```

---

## Pagination ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/pagination)) {#pagination}

Specify how many results to return per query. Hunch uses a page size and number:

- Size: the number of results to include.
- Number: the number of the page, aka the offset, as a zero-index.


Specify how many results with `page[size]` and a pagination offset with `page[number]`

### Programmatic

- Name: `pageSize` and `pageNumber`
- Type: `Integer`

Example:

```json
{ "pageSize": 4, "pageNumber": 2 }
```

### Query Parameter

- Name: `page[size]` and `page[number]`
- Type: `String` - Converted using `parseInt`

Example:

```json
{ "page[size]": "4", "page[number]": "2" }
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

## Specific Fields ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/specific-fields)) {#specific-fields}

Limit the text query to one or more metadata properties. (Hunch defaults to searching every field configured as searchable.)

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

## Stop Words ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/stop-words)) {#stop-words}

As part of the index generation, Hunch supports supplying a list of stop words (words that are "filtered out (i.e. stopped) before or after processing of text because they are insignificant" [–Wikipedia](https://en.wikipedia.org/wiki/Stop_word)).

Since stop words are entirely language and context dependent, HunchJS *does not* ship with any default stop words, but you instead supply them [in configuration](./configuration.md).

---

## Suggest ([Examples](https://github.com/tobiaslabs/hunch/blob/main/test/feature/suggest)) {#suggest}

Instead of search results, Hunch can give you back suggested search strings based on your indexed data.

For example, the query text `arch` might suggest `archery sport` and `march madness` as better search queries.

:::caution

The output from Hunch is different for a suggestion (see the [search results](./results.md) docs for details). The output looks like this:

```json
{
	"suggestions": [
		{ "q": "archery sport", "score": 1.305 },
		{ "q": "march madness", "score": 0.073 }
	]
}
```

:::

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