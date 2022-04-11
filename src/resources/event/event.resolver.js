/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    eventSearch: (parent, args, { dataSources }) =>
      dataSources.eventAPI.searchEvents({ query: args }),
    event: (parent, { eventID, datasetKey }, { dataSources }) =>
      dataSources.eventAPI.getEventByEventID({ eventID, datasetKey })
  },
  Event: {
    eventID: ({ _id }) => ( _id),
    parentEventID: ({ _source }) => ( _source.parentEventId),
    samplingProtocol: ({ _source }) => ( _source.samplingProtocolJoined),
    datasetKey: ({ _source }) => ( _source.datasetKey),
    datasetTitle: ({ _source }) => ( _source.datasetTitle),
    country: ({ _source }) => ( _source.country),
    countryCode: ({ _source }) => ( _source.countryCode),
    decimalLatitude: ({ _source }) => ( _source.coordinates.lat),
    decimalLongitude: ({ _source }) => ( _source.coordinates.lon)
  }
};
