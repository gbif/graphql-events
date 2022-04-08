const { gql } = require('apollo-server');

const typeDef = gql`
  scalar JSON
`;

module.exports = typeDef;