import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: "/api/graphql",
        credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
});

export default apolloClient;
