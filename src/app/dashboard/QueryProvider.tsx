"use client"

import {useState} from "react";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";


export default function QueryProvider({children}) {
    const [client] = useState(new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: false
            }
        }
    }))

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}
