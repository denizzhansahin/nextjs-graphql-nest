import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', // NestJS GraphQL endpoint'i
  cache: new InMemoryCache(),
});

export default client;
