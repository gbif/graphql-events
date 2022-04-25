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
    facets: [Facet]
  }

  type Facet {
    name: String!
    counts: [FacetCount]
  }
  
  type FacetCount {
    name: String!
    count: Int!
  }  

  type Event {
    eventID: String
    type:String
    eventType: String
    parentEventID: String    
    datasetKey: String
    datasetTitle: String
    samplingProtocol: String
    sampleSizeUnit: String
    sampleSizeValue: Int
    stateProvince: String
    country: String
    countryCode: String
    year: Int
    month: Int
    day: Int
    eventDate: String
    decimalLatitude: Float
    decimalLongitude: Float
    occurrenceCount: Int
    childEventCount: Int        
  }

  
`;

module.exports = typeDef;