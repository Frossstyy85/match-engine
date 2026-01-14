import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { readFileSync } from "fs";
import path from "path";

import { resolvers } from "@/graphql/resolvers";

const typeDefs = gql(
    readFileSync(path.join(process.cwd(), "src/graphql/schema.gql"), "utf8")
);


const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler(server)

export { handler as GET, handler as POST };