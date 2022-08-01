const _ = require('lodash');
const get = _.get;
const { RESTDataSource } = require('apollo-datasource-rest');
const xml2js = require('xml2js');
// load configuration based on .env file, cli arguments and default values.
const config = require('../../config');

const { apiEs, apiEsKey, es2vt, apiDownloads } = config;
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

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({ query })
    return response.documents;
  }

  async getArchive(datasetKey){
    try {
      let response = await this.get(apiDownloads + '/event/dataset/' + datasetKey, {signal: this.context.abortController.signal});
      // map to support APIv1 naming
      return response;
    } catch (err) {
      return {
        url: null,
        fileSizeInMB: null,
        modified: null
      }
    }
  }

  searchEvents = async ({ query }) => {
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

  searchOccurrences = async ({ query }) => {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get('/occurrence', { body: JSON.stringify(body) }, { signal: this.context.abortController.signal });
    } else {
      response = await this.post('/occurrence', body, { signal: this.context.abortController.signal });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    return response;
  }

  async getEventByKey({ eventID, datasetKey }) {
    return this.get(`/event/key/${datasetKey}/${encodeURIComponent(eventID)}`);
  }

  async getDatasetEML({ datasetKey }) {
    var parser = new xml2js.Parser(/* options */);
    const url = config.datasetEml.replace('{datasetKey}', datasetKey)
    const xml = await this.get(url);
    const datasetJson = await parser.parseStringPromise(xml);
    const dataset = get(datasetJson, "['eml:eml'].dataset[0]");
    const additionalMetadata = get(datasetJson, "['eml:eml'].additionalMetadata[0]");
    const datasetCurated = {
      key: datasetKey,
      title: get(dataset, 'title[0]._'),
      abstract: get(dataset, 'abstract[0].para[0]'),
      purpose: get(dataset, 'purpose[0].para[0]'),
      intellectualRights: get(dataset, 'intellectualRights[0].para[0]'),
      methods: get(dataset, 'methods'),
      contact: get(dataset, 'contact'),
      citation: get(additionalMetadata, 'metadata[0].gbif[0].citation'),
      rights: get(additionalMetadata, 'metadata[0].gbif[0].rights')
    };

    // return datasetCurrated;
    return {
      value: datasetCurated,
      raw: datasetJson
    };
  }

  async getLocation({ locationID }){
    let query = JSON.stringify({locationID: locationID})
    let response = await this.get('/event', { body: query }, { signal: this.context.abortController.signal });
    return response.documents.results[0];
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