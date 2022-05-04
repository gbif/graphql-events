const { getFacet } = require('./helpers/getMetrics');
const { formattedCoordinates } = require('./helpers/utils');
const fieldsWithFacetSupport = require('./helpers/fieldsWithFacetSupport');

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName);
  return dictionary;
};
const EventFacet = fieldsWithFacetSupport.reduce(facetReducer, {});

/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    eventSearch: (parent, {predicate, ...params}) => {
      return {
        _predicate: predicate,
        _params: params
      };
    },
    event: (parent, { key }, { dataSources }) =>
      dataSources.eventAPI.getEventByKey({ key }),
  },
  EventSearchResult: {
    documents: (parent, query, { dataSources }) => {
      return dataSources.eventAPI.searchEventDocuments({
        query: { predicate: parent._predicate, ...parent._params, ...query }
      });
    },
    facet: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.eventAPI.meta({
        query: { predicate: parent._predicate }
      });
    }
  },
  EventFacet,
  Event: {
    formattedCoordinates: ({ decimalLatitude, decimalLongitude }) => {
      return formattedCoordinates({ lat: decimalLatitude, lon: decimalLongitude });
    },
  },
  EventFacetResult_dataset: {
    datasetTitle: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.eventAPI.searchEventDocuments({ query: {datasetKey: key}, size: 1 })
        .then(response => {
          return response.results[0].datasetTitle
        });
    }
  }
};
