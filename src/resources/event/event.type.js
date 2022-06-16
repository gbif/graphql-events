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
    
    location(locationID: String): Event
  }

  type EventSearchResult {
    """
    The events that match the filter
    """
    documents(size: Int, from: Int, randomize: Boolean): EventDocuments!
    """
    Get number of events per distinct values in a field. E.g. how many events per year.
    """
    facet: EventFacet
    """
    Get number of events per distinct values in a field. E.g. how many events per year.
    """
    temporal: EventTemporal    
    """
    Get statistics for a numeric field. Minimimum value, maximum etc.
    """
    stats: EventStats
    _predicate: JSON
    """
    Register the search predicate with the ES tile server
    """
    _tileServerToken: String,
    _meta: JSON
  }

  type EventDocuments {
    size: Int!
    from: Int!
    total: Int!
    results: [Event]!
  }

  type Event {
    eventID: String
    type:String
    eventType: EventType
    parentEventID: String    
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
    parentEvent: Event
    kingdoms: [String]
    phyla: [String]
    orders: [String]
    classes: [String]
    families: [String]
    genera: [String]
    eventHierarchy: [String]
    eventHierarchyJoined: String
    eventTypeHierarchy: [String]    
    eventTypeHierarchyJoined: String
    eventHierarchyLevels: Int
    locationID: String
  }

  type EventType {
    concept: String
    lineage: [String]
  }

  type EventFacet {
    kingdoms(size: Int, include: String): [EventFacetResult_string]
    phyla(size: Int, include: String): [EventFacetResult_string]
    classes(size: Int, include: String): [EventFacetResult_string]
    orders(size: Int, include: String): [EventFacetResult_string]
    families(size: Int, include: String): [EventFacetResult_string]
    genera(size: Int, include: String): [EventFacetResult_string]
    eventHierarchyJoined(size: Int, include: String): [EventFacetResult_string]
    eventHierarchy(size: Int, include: String): [EventFacetResult_string]
    eventTypeHierarchyJoined(size: Int, include: String): [EventFacetResult_string]
    eventTypeHierarchy(size: Int, include: String): [EventFacetResult_string]
    locality(size: Int, include: String): [EventFacetResult_string]
    samplingProtocol(size: Int, include: String): [EventFacetResult_string]
    measurementOrFactTypes(size: Int, include: String): [EventFacetResult_string]
    stateProvince(size: Int, include: String): [EventFacetResult_string]
    datasetKey(size: Int, include: String): [EventFacetResult_dataset]
    measurementOfFactTypes(size: Int, include: String): [EventFacetResult_dataset]
    locationID(size: Int, include: String): [EventFacetResult_string]
    year(size: Int, include: String): [EventFacetResult_string]
    month(size: Int, include: String): [EventFacetResult_string]
  }
  
  type EventTemporal {
    datasetKey(size: Int, include: String): EventTemporalCardinalityResult
    locationID(size: Int, include: String): EventTemporalCardinalityResult
  }  
  
  type EventTemporalCardinalityResult {
    cardinality: Int!
    results: [EventTemporalResult_string]
  }    

  type EventFacetResult_string {
    key: String!
    count: Int!
    facet: EventFacet
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventTemporalResult_string {
    key: String!
    count: Int! 
    breakdown: [YearBreakdown]  
    temporal: EventTemporal
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON    
  }

  type YearBreakdown {
    y: Int!
    c: Int!
    ms: [MonthBreakdown]
  }

  type MonthBreakdown {
    m: Int!
    c: Int!
  }

  type EventFacetResult_dataset {
    key: String!
    count: Int!
    datasetTitle: String!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventStats {
    occurrenceCount: Stats!
  }

  type Stats {
    count: Float!
    min: Float
    max: Float
    avg: Float
    sum: Float
  }
`;

module.exports = typeDef;