const { RESTDataSource } = require('apollo-datasource-rest');
const { ApolloError } = require('apollo-server-errors');
const hardcodedData = require('./hardcodedData');
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
    const results = q ? hardcodedData.filter(result => result.protocol.indexOf(q) > -1) : hardcodedData;
    
    return { 
      limit,
      offset, 
      results: results.slice(offset, limit), 
      count: results.length
    };
  }

  async getEventByKey({ key }) {
    const event = hardcodedData.find(e => e.key === key);
    if (event) return event;
    throw new ApolloError('That key does not exists');
  }
}

module.exports = EventAPI;