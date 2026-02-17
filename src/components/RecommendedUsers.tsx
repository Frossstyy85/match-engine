"use client"

import {useQuery} from "@tanstack/react-query";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

const recommendedUsers = [
    {
        id: 1,
        name: "John",
        matchedSkills: [
            { id: 1, name: "react" },
            { id: 2, name: "javascript" }
        ]
    },
    {
        id: 2,
        name: "Sarah",
        matchedSkills: [
            { id: 3, name: "nodejs" },
            { id: 4, name: "mongodb" }
        ]
    },
    {
        id: 3,
        name: "Michael",
        matchedSkills: [
            { id: 5, name: "typescript" },
            { id: 6, name: "nextjs" }
        ]
    },
    {
        id: 4,
        name: "Emma",
        matchedSkills: [
            { id: 7, name: "python" },
            { id: 8, name: "django" }
        ]
    }
];


function fetchRecommendedUsers(projectId: number): any[] {
    return recommendedUsers
}


export default function RecommendedUsers({ projectId}) {


    const { data, isLoading, error } = useQuery({
        queryKey: ["recommendedUsers", projectId],
        queryFn: () => fetchRecommendedUsers(projectId),
    })

    if (isLoading) {
        return <p>loading...</p>
    }

    return (
        <div>
            <p>Top candidates</p>
            <div className={"flex gap-4"}>
                {data.map((user) => (
                    <Card className={"h-45 w-45"} key={user.id}>
                        {user.name}
                    </Card>
                ))}
            </div>
        </div>
    )

}