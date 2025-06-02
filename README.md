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
