![Context Mapper](https://raw.githubusercontent.com/wiki/ContextMapper/context-mapper-dsl/logo/cm-logo-github-small.png)
# Context Mapper DSL Language Server

> **_NOTE:_** This language server is a proof of concept and does not support all Context Mapper features yet.

[Context Mapper](https://contextmapper.org/) is an open source tool providing a Domain-specific Language based on Domain-Driven Design (DDD) patterns for context mapping and service decomposition.

## System Requirements
The Context Mapper language server is implemented with Langium. To run the language server the following tools have to be installed locally:
* [Node.js](https://nodejs.org/en/download) (v22)

## Build and/or Run the language server

### Requirements
To build the language server the following tools have to be installed locally:
* [corepack](https://github.com/nodejs/corepack): Corepack is needed to install yarn v4. For that corepack has to be enabled with `corepack enable`.
  (Corepack is included in v22 of Node.js)

### Build
To build the language server, the Langium resources have to be generated first:
```bash
yarn langium:generate
```
Then you can execute:
```bash
yarn build
```

### Bundle
For distribution, the language server is bundled into a single file using `ncc`. To bundle the language server execute:
```bash
yarn bundle:language-server
```

### Running the language server
To execute the bundled language server execute:
```bash
node cml-ls/index.js --stdio
```

## Contributing
Contribution is always welcome! Here are some ways how you can contribute:
* Create Github issues if you find bugs or just want to give suggestions for improvements.
* This is an open source project: if you want to code, [create pull requests](https://help.github.com/articles/creating-a-pull-request/) from [forks of this repository](https://help.github.com/articles/fork-a-repo/). Please refer to a Github issue if you contribute this way.
* If you want to contribute to our documentation and user guides on our website [https://contextmapper.org/](https://contextmapper.org/), create pull requests from forks of the corresponding page repo [https://github.com/ContextMapper/contextmapper.github.io](https://github.com/ContextMapper/contextmapper.github.io) or create issues [there](https://github.com/ContextMapper/contextmapper.github.io/issues).

## Licence
ContextMapper is released under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
