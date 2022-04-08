const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    eventSearch(
      limit: Int, 
      offset: Int, 
      q: String
      ): EventSearchResults
    event(key: ID!): Event
  }

  type EventSearchResults {
    results: [Event]!
    limit: Int!
    offset: Int!
    count: Int!
  }

  type Event {
    key: ID!
    protocol: String
    """
    This is a field comment. And below is a special field. It isn't in the response, but use a custom resolver and a custom scalar.
    """
    mySpecialField: JSON
  }
`;

module.exports = typeDef;