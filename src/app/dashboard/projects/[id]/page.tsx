"use client"

import {useParams} from "next/navigation";
import {useGraph} from "@/lib/hooks";
import {useEffect, useState} from "react";
import Modal from "@/components/modal/Modal";

export default function ProjectPage(){

    const { id } = useParams();

    const [editConfigurationModal, setEditConfigurationModal] = useState(false);


    const fetchConfigurations = async () => {

    }

    useEffect(() => {

        if (editConfigurationModal){
            fetchConfigurations().then(() => {

            })
        }

    }, [editConfigurationModal])


    const { data, loading, error } = useGraph(`
    query($projectId: ID!) {
  project(projectId: $projectId) {
  id
  name
  status
    recommendedUsers {
      user_id
      user_name
      match_percentage
      role_name
      matched_skills
      role_configuration_id
    }
  }
}`,
        {
            variables: {
                projectId: id
            }
        })

    if (loading) return <div>loading...</div>

    return <div>
        <button onClick={() => setEditConfigurationModal((prev) => !prev)}>Edit profiles</button>

        {editConfigurationModal &&
            <Modal isOpen={editConfigurationModal} onClose={() => setEditConfigurationModal((prev) => !prev)}>
                <div></div>
            </Modal>
        }

        <pre>{JSON.stringify(data, null, 3)}</pre>


    </div>

}