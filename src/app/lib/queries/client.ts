import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";


const httpLink = new HttpLink({
  uri: `https://api.studio.thegraph.com/query/109132/ionic/version/latest`,
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
