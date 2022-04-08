# GraphQL API for events
This is currently just a stub to start a discussion between ALA and GBIF

## Node version
Use node 16.14.2. You probably want to install NVM (Node Version Manager) if you haven't already.

## Development
Run in dev (watch using nodemon) with `npm start`. You will need an .env file (YAML) with 

```yml
port: 4000

# this section isn't used currently, but ES specific configurations could go here
event:
  hosts: [http://node1.elasticsearch:9200/, http://node2.elasticsearch:9200/] # whatever your es nodes are called
  requestTimeout: 60000
  maxRetries: 3
  maxResultWindow: 100000
  index: event

debug: true # this enables extra logging and error details in responses. Should not be used in production.
```

## Production
run with `node src/index.js`

## Code formatting and linting
Code is formatted with default settings of [Prettier](https://prettier.io/)  - [Visual studio plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Linting via [eslint](https://eslint.org/)