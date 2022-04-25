const { RESTDataSource } = require('apollo-datasource-rest');
const { ApolloError } = require('apollo-server-errors')
// load configuration based on .env file, cli arguments and default values.
const config = require('../../config');

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: config.event.host,
  auth: {
    username: config.event.username ,
    password: config.event.password
  }
})


/*
Caveat: since we want everything to be one project, then a REST datasource hardly makes sense. 
There are probably other options, or we can write our own. I only have experience using this type of sources

For now it just use hardcoded data. This should instead contact the ElasticSearch endpoint(s)
*/
class EventAPI extends RESTDataSource {
  constructor() {
    super();
  }

  async searchEvents({ query = {} }) {
    const { q, limit = 20, offset = 0 } = query;
    // let query_string = q ? q + " AND type:event" : "type:event"
    let query_string = q ? q : "*"
    const result = await client.search({
      index: config.event.index,
      from: offset < 1000 ? offset : 0,
      size: limit < 1000 ? limit : 30,
      query: {
        bool: {
          must: [
            {query_string: {
              query: query_string
            }}
          ],
          filter: [{
            match: {"type": "event"}
          }]
        }
      },
      aggregations: {
        samplingProtocol:
          {
            terms: { field: "event.samplingProtocol.keyword", size: 10 }
          },
        datasetTitle:
            {
              terms: { field: "datasetTitle", size: 10 }
            },
        eventType:
            {
              terms: { field: "event.eventType", size: 10 }
            },
        stateProvince:
            {
              terms: { field: "event.stateProvince.keyword", size: 10 }
            }
      }
    });

    function resultCon(eventResult){
      return {"event": eventResult, "childCount": null, "occurrenceCount": null};
    }

    function resultsAgg(aggregations){

      let facets = []

      for (const facetName of Object.keys(aggregations)) {

        let facet = {
          name: facetName,
          counts: []
        }

        for (const bucket of aggregations[facetName].buckets) {
           let facetCount = {
             name: bucket.key,
             count: bucket.doc_count
           }
           facet.counts.push(facetCount)
        }

        facets.push(facet);
      }
      return facets;
    }

    return {
      limit,
      offset,
      results: result.hits.hits.map( x => resultCon(x._source) ),
      count: result.hits.total.value,
      facets: resultsAgg(result.aggregations)
    };
  }


  async getEventByEventID({ eventID, datasetKey }) {

    if (eventID && datasetKey){

      // do the event search
      const eventSearchResult = await client.search({
        index:  config.event.index,
        query: {
          bool: {
            must: [
              {
                "match": {
                  "id": eventID
                }
              },
              {
                "match": {
                  "metadata.datasetKey": datasetKey
                }
              }
            ]
          }
        }
      })

      if (eventSearchResult && eventSearchResult.hits.total.value > 0) {
        const event = eventSearchResult.hits.hits[0];

        // do the child event search
        const childEventResult = await client.count({
          index: config.event.index,
          query: {
            bool: {
              must: [
                {
                  "match": {
                    "event.parentEventId": eventID
                  }
                },
                {
                  "match": {
                    "metadata.datasetKey": datasetKey
                  }
                }
              ]
            }
          }
        })
        const childEventCount = childEventResult.count;

        return {
          event: event._source,
          childEventCount: childEventCount,
          occurrenceCount: 123
        };
      } else {
        throw new ApolloError('That eventID and datasetKey combination does not exists');
      }

    } else {
      throw new ApolloError('Please supply an eventID and datasetKey');
    }
  }


  async getOccurrenceCountForEventID({ eventID, datasetKey }) {
    if (eventID && datasetKey){

      const result = await client.search({
        index:  config.event.index,
        query: {
          match: { id: eventID, datasetKey: datasetKey }
        }
      })

      if (result) {
        return result;
      }
      throw new ApolloError('That eventID and datasetKey combination does not exists');
    } else {
      throw new ApolloError('Please supply an eventID and datasetKey');
    }
  }

}

module.exports = EventAPI;