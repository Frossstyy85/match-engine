"use client"

import {useEffect, useState} from "react";


export function useAuth(){
    const user = {
        name: "temp",
        email: "temp@gmail.com"
    }
    return user;
}

export  function useGraph(query: string, variables?: {}){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);


    useEffect(() => {
        setLoading(true)
        setError(null)

        fetch("/api/graphql", {
            method: "POST",
            body: JSON.stringify({ query: query, variables: variables }),
            headers: { "Content-Type": "application/json", },

        })
            .then(res => res.json())
            .then(res => res.data)
            .then(data => setData(data))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    },[]);
    return {
        loading: loading,
        error: error,
        data: data
    }
}