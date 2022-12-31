## Content Processing

Hunch will work without pre-processing if you use YAML-flavored frontmatter and plain Markdown. For different content (e.g. GitHub flavored, MultiMarkdown, etc.) you may be able to configure SearchMD will need to pre-process it. If you use anything more exotic or esoteric, you may need to convert it into a SearchMD-usable file tree as your own pre-processing step before running SearchMD.

The steps of processing are as follows:

1. Filepaths are grabbed using the `glob` property.
2. If provided, those files are filtered using the `preFilter` function.
3. The files are read from disk and the frontmatter is parsed as YAML to become a metadata object.
4. If provided, each metadata object is passed through the `normalizeMetadata` function.
5. If provided, the parsed file objects are further filtered using the `processedFilter` function.

## Pre-Processing

Under the covers, Hunch makes use of [UnifiedJS](https://unifiedjs.com/) to process the content files into an AST (Abstract State Tree) to be able to generate a search index construction. This means you can configure SearchMD' pre-processing using plugins/extensions in the [syntax-tree](https://github.com/syntax-tree/mdast-util-gfm) ecosystem.

For example, adding support for GitHub flavored Markdown is as easy as:

```js
// hunch.config.js
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown } from 'mdast-util-gfm'
export default {
	micromarkExtensions: [
		gfm(),
	],
	mdastExtensions: [
		gfmFromMarkdown(),
	],
}
```

## Post-Processing

Hunch internally converts content files to plaintext (without any markup) broken down into smaller chunks. These chunks are used for the initial text lookups, and the results are then used to match to chunks from the original content file. These content chunks are what is passed back from SearchMD.

For example, given a markdown section like this:

```markdown
My *dogs* are barking.
```

Hunch will convert that to `my dogs are barking` so that a search for `"dogs are barking"` will rank correctly, but the search result will be the original `My *dogs* are barking.`

The final content chunks aren't used by Hunch internally, but they

TODO:
what about e.g. a search for `word1 word2` where the markdown is `word1 *word2*` or `word1 <span>word2</span>`
it's like you need a sourcemap from `word1 *word2*` to the plaintext, do a search on the plaintext, and then map to the original
could go simple for now, e.g. flatten everything for indexing, then return the results as whatever format you like
