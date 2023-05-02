require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const resolvers = require("./gql-resolvers");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { loadSchema } = require("@graphql-tools/load");

const startApollo = async () => {
  const typeDefs = await loadSchema("schema.graphql", {
    loaders: [new GraphQLFileLoader()],
  });
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen();
  console.log(`Apollo server running at ${url}`);
};

startApollo();