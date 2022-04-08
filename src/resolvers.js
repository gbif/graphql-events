/*
When starting Apollo we need all our resolvers as one, but it is inconvinent to write them in one file.
So instead we merge them here.
*/
const _ = require('lodash');

const resolvers = _.merge(
  require('./resources/scalars').resolver,
  require('./resources/event').resolver,
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
module.exports = {
  resolvers
};