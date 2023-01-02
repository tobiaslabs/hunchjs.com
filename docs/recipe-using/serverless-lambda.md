---
sidebar_position: 4
---

# Serverless.com (using AWS)

Drop-in recipe for deploying to AWS Lambda as an AWS API Gateway endpoint handler, using the serverless.com CLI tool.

To show how simple deployment can be, let's build an entire AWS API Gateway, backed by an AWS Lambda, deployed using [serverless](https://www.serverless.com/), and we'll do it automatically with GitHub Workflows.

The folder structure looks like this:

```
/hunch.json
/lambda.js
/package.json
/serverless.yml
/.github/workflows/deploy.yml
```

The `hunch.json` is the compiled index file.

The `package.json` file looks something like this:

```json
{
	"name": "demo-hunch-lambda",
	"type": "module",
	"scripts": {
		"deploy": "serverless deploy"
	},
	"dependencies": {
		"hunch": "*",
		"serverless": "*"
	}
}
```

(You should certainly not use `*` as the version range, but this is a simple demo...)

The `serverless.yml` file is also pretty simple:

```yaml
service: demo-hunch-lambda
provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: develop
functions:
  search:
    name: search
    handler: lambda.handler
    events:
      - httpApi:
          method: GET
          path: /
```

Finally, here is the `index.js` file:

```js
import { hunch, normalize } from 'hunch'
import { readFile } from 'node:fs/promises'

const data = JSON.parse(await readFile('./hunch.json'))
const search = hunch({ data })

export const handler = async event => {
	const query = normalize(event.queryStringParameters)
	const results = search(query)
	return {
		statusCode: 200,
		body: JSON.stringify(results),
		headers: { 'content-type': 'application/json' },
	}
}
```

To deploy the first time, running `npm run deploy` (assuming you've got credentials set up) will deploy an AWS API Gateway, something like this:

```bash
$ npm run deploy
> serverless deploy
Deploying demo-hunch-lambda to stage develop (us-east-1)
Service deployed to stack demo-hunch-lambda-develop (54s)
endpoint: GET - https://y2je9nk7sq.execute-api.us-east-1.amazonaws.com/
functions:
  search: demo-hunch-lambda (9 MB)
```

You can test in the browser by hitting your generated endpoint URL:

```bash
curl https://y2je9nk7sq.execute-api.us-east-1.amazonaws.com/?q=fancy%20words&facets%5Btags%5D=cats%2c-rabbits
```

To get auto-deploy on merge, we set up this GitHub Workflow (if you're already using Workflow you'll simply want to add the `deploy` step at the end):

```yaml
# /.github/workflows/deploy.yml
name: demo-hunch-lambda
on:
  push:
    branches: [ 'main' ]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 16.x ]
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm run deploy
      env:
        AWS_REGION: us-east-1
        AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

You'll also need to go add those three secrets to your GitHub repo.

Now you've got a fully functioning search API for your static content, and it'll deploy any time a merge happens to your `main` branch. 🎉
