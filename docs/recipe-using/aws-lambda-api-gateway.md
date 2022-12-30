---
sidebar_position: 1
---

# AWS Lambda (API Gateway)

Drop-in recipe for using Hunch from an AWS Lambda, as a handler for an AWS API Gateway.

## Prerequisite

Start with the tutorial on [indexing an 11ty site](/docs/recipe-index/11ty).

## Folder Structure

Instead of sending the Hunch output to `_site/hunch.json` we'll create a new folder called `_lambda` that we can zip up as a Lambda image.

> Note: if you're not familiar with this approach, the AWS docs ([here](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html) and [here](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-package.html#gettingstarted-package-zip)) will tell you more. The summary of it is that the `.zip` file needs to hold everything accessible to the Lambda runtime.

```
/_lambda
	/hunch.json
	/index.js
	/dist
		/hunch.js
		/normalize.js
```

The files are as follows:

- `hunch.json` - This is the Hunch output, aka the compiled index file.
- `index.js` - The code that the Lambda will execute.
- `dist/` - These are files bundled with Hunch. For this demo we'll manually copy+paste the files.
- `dist/hunch.js` - The core search functionality.
- `dist/normalize.js` - Normalize HTTP query parameters to a Hunch query object.

## File Contents

For this demo, look in the `./node_modules/hunch/dist` folder and manually copy those files over to `_lambda/dist`.

Then, in the `index.js` file we have this simple code:

```js
// Load the compiled index:
import { readFile } from 'node:fs/promises'
const index = JSON.parse(await readFile('./hunch.json'))

// Create an instance of Hunch using that data:
import { hunch } from './dist/hunch.js'
const search = hunch({ index })

// This will normalize the API Gateway query parameters.
import { normalize } from './dist/hunch.js'

// This is the exported Lambda event handler function:
export const handler = async event => {
	// A sample API Gateway request would have something like:
	// event.queryStringParameters = {
	//     q: 'fancy words',
	//     'facet[tags]': 'cats,-rabbits',
	// }
	// So we need to normalize it to a HunchQueryObject:
	const query = normalize(event.queryStringParameters)
	const results = search(query)
	return {
		statusCode: 200,
		body: JSON.stringify(results),
		headers: { 'content-type': 'application/json' },
	}
}
```

If you don't need authentication or anything else, that's really all there is to it.

## Deploy

If you want to manually deploy the `_lambda` folder, the [AWS docs](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html) will walk you through that, but using a deploy tool like `serverless` (see the recipe [here](/docs/recipe-using/serverless-lambda)) instead.
