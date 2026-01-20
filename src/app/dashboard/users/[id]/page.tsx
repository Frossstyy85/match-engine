"use client"

import {useParams} from "next/navigation";
import {useGraph} from "@/lib/hooks";
import {json} from "node:stream/consumers";

export default function UserPage(){
    const { id } = useParams();


    const { data, loading, error } = useGraph(`
    query userWithProjectMatch($userId: ID!) {
  user(userId: $userId) {
    id
    name
    email
    recommendedProjects {
      project_id
      project_name
      match_percentage
      role_name
      matched_skills
      role_configuration_id
     
    }
  }
}`,
        {
            variables: {
                userId: id
            }
        })

    if (loading) return <div>loading...</div>

    return <div>
      <pre>{JSON.stringify(data, null, 3)}</pre>
    </div>



}