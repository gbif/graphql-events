const { RESTDataSource } = require('apollo-datasource-rest');
const { ApolloError } = require('apollo-server-errors')
// load configuration based on .env file, cli arguments and default values.
const config = require('../../config');
/*
Caveat: since we want everything to be one project, then a REST datasource hardly makes sense. 
There are probably other options, or we can write our own. I only have experience using this type of sources

For now it just use hardcoded data. This should instead contact the ElasticSearch endpoint(s)
*/
class EventAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = config.event.host + '/' + config.event.index + '/_search';
  }

  willSendRequest(request) {
    if (config.event.username != null && config.event.password != null) {
      let token = btoa(config.event.username + ":" + config.event.password)
      request.headers.set('Authorization', "Basic " + token);
    }
  }

  async searchEvents({ query = {} }) {
    const { q, limit = 20, offset = 0 } = query;
    let response = await this.get(this.baseURL + "?size=" + limit + "&from="+ offset)
    return {
      limit,
      offset,
      results: response.hits.hits,
      count: response.hits.total.value
    };
  }

  async getEventByEventID({ eventID, datasetKey }) {
    if (eventID && datasetKey){
      let response = await this.get(this.baseURL + '?q=id:' + eventID + " AND datasetKey:" + datasetKey)
      const event = response.hits.hits[0];
      if (event) return event;
      throw new ApolloError('That eventID and datasetKey combination does not exists');
    } else {
      throw new ApolloError('Please supply an eventID and datasetKey');
    }
  }
}

module.exports = EventAPI;