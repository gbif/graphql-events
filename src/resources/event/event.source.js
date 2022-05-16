const { RESTDataSource } = require('apollo-datasource-rest');
// load configuration based on .env file, cli arguments and default values.
const config = require('../../config');

const { apiEs, apiEsKey, es2vt } = config;
const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters


class EventAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = apiEs;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('Authorization', `ApiKey-v1 ${apiEsKey}`);
  }

  async searchEventDocuments({ query }) {
    const response = await this.searchEvents({ query })
    return response.documents;
  }

  async searchEvents({ query }) {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get('/event', { body: JSON.stringify(body) }, { signal: this.context.abortController.signal });
    } else {
      response = await this.post('/event', body, { signal: this.context.abortController.signal });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    return response;
  }

  async getEventByKey({ eventID, datasetKey }) {
    return this.get(`/event/key/${datasetKey}/${eventID}`);
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/event/meta', body);
    return response;
  }

  async registerPredicate({ predicate }) {
    try {
      const metaResponse = await this.meta({ query: {predicate} });
      const query = metaResponse.query;
      let response = await this.post(`${es2vt}/register`, {query: {query, grid_type: 'centroid'}}, { signal: this.context.abortController.signal });
      return response.queryId;
    } catch (err) {
      console.log(err);
      return {
        err: {
          error: 'FAILED_TO_REGISTER_PREDICATE'
        },
        predicate: null
      }
    }
  }
}

module.exports = EventAPI;