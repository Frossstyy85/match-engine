"use client"

import {useEffect, useState} from "react";


export function useAuth(){
    const user = {
        name: "temp",
        email: "temp@gmail.com"
    }
    return user;
}

interface GraphResult {
    loading: boolean,
    error: any,
    data: any
    refetch: () => void
}

export function useGraph(query: string, variables: Record<string, any>): GraphResult {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);


    function fetchData(){
        setLoading(true)
        setError(null)

        fetch("/api/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            credentials: "include",
            body: JSON.stringify({ query: query, variables: variables }),
        })
            .then(res => res.json())
            .then(res => res.data)
            .then(data => setData(data))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
       fetchData();
    },[]);

    return {
        loading: loading,
        error: error,
        data: data,
        refetch: fetchData
    }
}