const { JSONResolver } = require('graphql-scalars');

module.exports = {
  JSON: JSONResolver, // last resort type for unstructured data
};