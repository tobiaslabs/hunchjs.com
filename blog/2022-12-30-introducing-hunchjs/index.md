---
slug: introducing-hunchjs
title: Introducing HunchJS
authors: [saibotsivad]
---

When a new software offering is launched, it makes sense to explain what the reason is for making it.

I have been a casual user of Algolia for some time, but there is a particular use-case which is not well-supported: if you have a large content library, such as a set of Markdown files with templates, such that changing one template might modify many documents at the same time.

Here's an example that comes from a client:

- Around 700 long research articles.
- Within each article, the possibility of a template, e.g. for Amazon links it might be `::asin|12345678::` which gets converted to a link with some form of tracking.
- These articles are compiled to static HTML files, which are the things that should be indexed by a search engine.
- It is possible that changing a template might change the generated HTML for nearly all 700 articles.
- During the course of a website update, it is possible that the template might be changed dozens of times, triggering a re-index each time.

In the case of Algolia, because there is a size limit to records, those 700 articles turned into many thousand records. This means that a small change to a template might cause a re-index of many thousands of Algolia records, which would translate to a bill of around 40$ each time.

Given that the client might decide to rework their website at any time, through an iterative design process, it is possible that a day-long design process of a couple dozen iterations would result in an Algolia bill over a thousand dollars. For that day.

That is an unsettling surprise!

HunchJS aims to take the place of services like Algolia, *for content that fits the model*, by offering a search compiler that produces an index small enough to be hosted as an AWS Lambda function.

For example, if you have a bunch of Markdown+Frontmatter documents like this:

```md
---
title: My Cool Blog
tags: [ cats, dogs ]
---

Here are some words about my worldly travels.
```

You can use HunchJS to read through your content and generate an index file that you'd *easily* bundle into an AWS Lambda function.

How easy, you might wonder?

```js
import { readFile } from 'node:fs/promises'
import { hunch, normalize } from 'hunch'
const index = JSON.parse(await readFile('./index.json', 'utf8'))
const search = hunch(index)
export const handler = (event, context) => ({
		statusCode: 200,
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(search(normalize(event.queryStringParameters))),
})
```

That's it. That's the entire code of the Lambda function.

But did you notice that the index is just a JSON file? HunchJS doesn't access the filesystem to search, so you can use it in environments that don't have a filesystem, like Cloudflare Pages [Functions](https://developers.cloudflare.com/pages/platform/functions):

```js
// /functions/search.js
import { hunch, normalize } from 'hunch'
let search
export async function onRequestGet(context) {
	if (!search) {
		const index = await context.env.YOUR_KV_BINDING.get('hunch_index', { type: 'json' })
		search = hunch(index)
	}
	const { searchParams } = new URL(context.request.url)
	return new Response(JSON.stringify(search(normalize(searchParams))))
}
```

And you can do the same sort of thing in the browser, so that you can do fully-local search.

Returning to my client example, what this means is that I can create a Lambda function that literally has only this:

```
/node_modules
	/hutch # you don't need everything, but note it's the only dependency
/index.json
/index.js
```

And then, whenever the content files change, the Lambda image is re-generated and deployed.

Hunch is still a work in progress--many of the tools and ideas of it are still in bits and pieces in other projects, so I'm still extracting it all.
