"use client";
import { ApolloProvider } from "@apollo/client/react";


import apolloClient from "@/lib/apolloClient";

export default function ApolloWrapper({ children }) {
    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
