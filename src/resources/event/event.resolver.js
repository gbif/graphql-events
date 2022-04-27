/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {

    event: (parent, { eventID, datasetKey }, { dataSources }) =>
        dataSources.eventAPI.getEventByEventID({ eventID, datasetKey }),

    eventSearch: (parent, args, { dataSources }) =>
      dataSources.eventAPI.searchEvents({ query: args })

  },
  Event: {
    eventID:          (parent) => ( parent.event.id),
    type:             (parent) => ( parent.event.type),
    datasetKey:       (parent) => ( parent.event.metadata ? parent.event.metadata.datasetKey : null),
    datasetTitle:     (parent) => ( parent.event.metadata ? parent.event.metadata.datasetTitle: null),

    eventType:        (parent) => ( parent.event.event ? parent.event.event.eventType.concept : null),
    parentEventID:    (parent) => ( parent.event.event ? parent.event.event.parentEventId : null),
    samplingProtocol: (parent) => ( parent.event.event ? parent.event.event.samplingProtocolJoined : null),
    stateProvince:    (parent) => ( parent.event.event ? parent.event.event.stateProvince : null),
    country:          (parent) => ( parent.event.event ? parent.event.event.country : null),
    countryCode:      (parent) => ( parent.event.event ? parent.event.event.countryCode : null),
    year:             (parent) => ( parent.event.event ? parent.event.event.year : null),
    month:            (parent) => ( parent.event.event ? parent.event.event.month : null),
    day:              (parent) => ( parent.event.event ? parent.event.event.day : null),
    eventDate:        (parent) => ( parent.event.event ? parent.event.event.eventDate : null),
    decimalLatitude:  (parent) => ( parent.event.event ? parent.event.event.decimalLatitude: null),
    decimalLongitude: (parent) => ( parent.event.event ? parent.event.event.decimalLongitude: null),
    childEventCount:  (parent) => ( parent.childEventCount ? parent.childEventCount : null),
    occurrenceCount:  (parent) => ( parent.event.event ? parent.event.event.occurrenceCount : null)
  }
};
