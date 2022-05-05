const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    
    eventSearch(
      apiKey: String,
      predicate: Predicate
      size: Int
      from: Int
      ): EventSearchResult
      
    event(eventID: String, datasetKey: String): Event
  }

  type EventSearchResult {
    """
    The events that match the filter
    """
    documents(size: Int, from: Int): EventDocuments!
    """
    Get number of events per distinct values in a field. E.g. how many events per year.
    """
    facet: EventFacet
    _predicate: JSON
    _meta: JSON
  }

  type EventDocuments {
    size: Int!
    from: Int!
    total: Int!
    results: [Event]!
  }

  type Event {
    eventId: String
    type:String
    eventType: EventType
    parentEventId: String    
    datasetKey: String
    locality: String
    datasetTitle: String
    samplingProtocol: [String]
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
    coordinates: JSON
    formattedCoordinates: String
    measurementOrFactTypes: [String]
    measurementOrFactCount: Int
  }

  type EventType {
    concept: String
    lineage: [String]
  }

  type EventFacet {
    locality(size: Int, include: String): [EventFacetResult_string]
    samplingProtocol(size: Int, include: String): [EventFacetResult_string]
    measurementOrFactTypes(size: Int, include: String): [EventFacetResult_string]
    stateProvince(size: Int, include: String): [EventFacetResult_string]
    datasetKey(size: Int, include: String): [EventFacetResult_dataset]
  }

  type EventFacetResult_string {
    key: String!
    count: Int!
    _predicate: JSON
  }

  type EventFacetResult_dataset {
    key: String!
    count: Int!
    datasetTitle: String!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }
`;

module.exports = typeDef;