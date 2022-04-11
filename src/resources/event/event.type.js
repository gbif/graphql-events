const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    eventSearch(
      limit: Int, 
      offset: Int, 
      q: String
      ): EventSearchResults
    event(eventID: String, datasetKey: String): Event
  }

  type EventSearchResults {
    results: [Event]!
    limit: Int!
    offset: Int!
    count: Int!
  }

  type Event {
    eventID: String
    samplingProtocol: String
    datasetKey: String
    datasetTitle: String
    parentEventID: String
    country: String
    countryCode: String
    decimalLatitude: Float
    decimalLongitude: Float    
  }
`;

module.exports = typeDef;