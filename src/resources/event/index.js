const EventAPI = require('./event.source');

module.exports = {
  resolver: require('./event.resolver'),
  typeDef: require('./event.type'),
  dataSource: {
    EventAPI
  }
};