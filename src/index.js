// standard node server
const express = require('express');
// express middleware that parse the body for easier consumption
const bodyParser = require('body-parser');
// to add CORS headers to responses
const cors = require('cors');
// gzip the response
const compression = require('compression');
// Apollo is our GraphQL library 
const { ApolloServer } = require('apollo-server-express');
// enable Playground - the visual interface that allows you to explore. Located at the url "/graphql" as default
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
// give us the option to cancel requests when the user does so (e.g. leaving the page in the browser)
const AbortController = require('abort-controller');
// custom middelware that allows querying by a registered hash
const { hashMiddleware } = require('./hashMiddleware');
// recommended in the apollo docs https://github.com/stems/graphql-depth-limit
const depthLimit = require('graphql-depth-limit');

// get the full schema of what types, enums, scalars and queries are available
const { typeDefs } = require('./typeDefs');
// define how to resolve the various types, fields and queries
const { resolvers } = require('./resolvers');
// how to fetch the actual data and possible format/remap it to match the schemas
const { api } = require('./dataSources');

// load configuration based on .env file, cli arguments and default values.
const config = require('./config');

const { EventAPI } = api;

async function initializeServer() {
  const server = new ApolloServer({
    debug: config.debug,
    context: async ({ req }) => {
      // Add express context and a listener for aborted connections. Then data sources have a chance to cancel resources
      // I haven't been able to find any examples of people doing anything with cancellation - which I find odd.
      // Perhaps the overhead isn't worth it in most cases?
      const controller = new AbortController();
      req.on('close', function () {
        controller.abort();
      });

      return { abortController: controller };
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
      eventAPI: new EventAPI()
    }),
    validationRules: [depthLimit(3)], // this limit is likely higher than 3, but it might be better to increase it based on real usage
    cacheControl: {
      defaultMaxAge: 600,
      scope: 'public',
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground
    ]
  });

  const app = express();
  app.use(compression());
  app.use(cors({
    methods: 'GET,POST,OPTIONS',
  }))
  app.use(bodyParser.json());

  // extract query and variables from store if a hash is provided instead of a query or variable
  app.use(hashMiddleware);

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: config.port }, () =>
    console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`)
  );
}

initializeServer();