const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema/schema');
const HeroAPI = require('./datasources/heroes');
const resolvers = require('./resolvers/resolvers');



const server = new ApolloServer(
  { 
    typeDefs,
    resolvers,
    dataSources: () => ({
      heroAPI: new HeroAPI()
    })

  }
);

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
