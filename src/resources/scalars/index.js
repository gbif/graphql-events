/*
Scalars allow us to introduce new field types. The standard comes with some (like String, Float), but it can be useful to add ones own.
*/
module.exports = {
  resolver: require('./scalars.resolver'),
  typeDef: require('./scalars.type'),
};