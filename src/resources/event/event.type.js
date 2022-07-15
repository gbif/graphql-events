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
    Get number of occurrences per distinct values in a field. E.g. how many occurrence per year.
    """    
    occurrenceFacet: OccurrenceFacet
    """
    Get number of occurrences matching this search
    """        
    occurrenceCount: Int
    
    """
    Get number of distinct values for a field. E.g. how many distinct datasetKeys in this result set
    """
    cardinality: EventCardinality

    """
    Get number of events per distinct values in a field. E.g. how many events per year.
    """
    temporal: EventTemporal    
    """
    Get statistics for a numeric field. Minimimum value etc.
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
    """
    get dataset information via EML
    """
    dataset: JSON!
    """
    Get number of distinct species for this event and its children
    """
    speciesCount: Int!
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
    locationID(size: Int, from: Int): [EventFacetResult_string]
    
    year(size: Int, from: Int): [EventFacetResult_float]
    month(size: Int, from: Int): [EventFacetResult_float]
  }
  
  type OccurrenceFacet {
    datasetKey(size: Int, include: String): [OccurrenceFacetResult_string]
    kingdom(size: Int, include: String): [OccurrenceFacetResult_string]
    phylum(size: Int, include: String): [OccurrenceFacetResult_string]
    class(size: Int, include: String): [OccurrenceFacetResult_string]
    order(size: Int, include: String): [OccurrenceFacetResult_string]
    family(size: Int, include: String): [OccurrenceFacetResult_string]
    genus(size: Int, include: String): [OccurrenceFacetResult_string]
    species(size: Int, include: String): [OccurrenceFacetResult_string]
    samplingProtocol(size: Int, include: String): [OccurrenceFacetResult_string]
    locationID(size: Int, include: String): [OccurrenceFacetResult_string]
    basisOfRecord(size: Int, include: String): [OccurrenceFacetResult_string]
    stateProvince(size: Int, include: String): [OccurrenceFacetResult_string]
    recordedBy(size: Int, include: String): [OccurrenceFacetResult_string]
    recordedById(size: Int, include: String): [OccurrenceFacetResult_string]
  }  

  type EventCardinality {
    species: Int!
    datasetKey: Int!
  }
  
  type EventTemporal {
    datasetKey(size: Int, include: String): EventTemporalCardinalityResult
    locationID(size: Int, from: Int, include: String): EventTemporalCardinalityResult
  }  
  
  type EventTemporalCardinalityResult {
    cardinality: Int!
    results: [EventTemporalResult_string]
  }    

  type EventFacetResult_string {
    key: String!
    count: Int!
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }
  
  type OccurrenceFacetResult_string {
    key: String!
    count: Int!
    _predicate: JSON
  }  
  
  type EventFacetResult_float {
    key: Float!
    count: Int!
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
    occurrenceCount: Int
    datasetTitle: String!
    archive: DataArchive  
    events(size: Int, from: Int): EventSearchResult!
    _predicate: JSON
  }

  type EventStats {
    occurrenceCount: Stats!
  }
  
  type DataArchive {
    url: String
    fileSizeInMB: Float
    modified: String   
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