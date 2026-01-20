import {startServerAndCreateNextHandler} from "@as-integrations/next";
import {ApolloServer} from "@apollo/server";
import {gql} from "graphql-tag";
import {readFileSync} from "fs";
import path from "path";
import {resolvers} from "@/graphql/resolvers";
import {AUTH_COOKIE_NAME} from "@/lib/authCookies";
import {getSession, Session} from "@/lib/session";
import {GraphQLError} from "graphql/error";
import {cookies} from "next/headers";


const typeDefs = gql(
    readFileSync(path.join(process.cwd(), "src/graphql/schema.gql"), "utf8")
);

const server = new ApolloServer({typeDefs, resolvers});

const handler = startServerAndCreateNextHandler(server, {
    context: async () => {

        const sessionId = await cookies()
            .then(store => store.get(AUTH_COOKIE_NAME)?.value);

        const session: Session = await getSession(sessionId);

        if (!session) {

            throw new GraphQLError('No Access', {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })


        }
        return {
            principal: session.principal
        }

    }
})


export {handler as GET, handler as POST};