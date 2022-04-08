const _ = require('lodash');

// not much to merge at his point, but if we had other datasources, we would add them here.
const api = _.merge(
  require('./resources/event').dataSource,
);

// merge data sources as suggested in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
module.exports = {
  api
};