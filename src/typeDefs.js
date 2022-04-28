/*
When starting Apollo we need all our type definitions as one, but it is inconvinent to write them in one file.
So instead we merge them here.
*/
const { gql } = require('apollo-server');

const rootQuery = gql`
    type Query
  `;

const typeDefs = [
  rootQuery,
  require('./input'),
  require('./resources/event').typeDef,
  require('./resources/scalars').typeDef,
];


module.exports = {
  typeDefs
};