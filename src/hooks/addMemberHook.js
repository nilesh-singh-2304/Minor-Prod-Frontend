import { useState } from "react";
import { ADD_USER_TO_COLLECTION } from "../api/collectionApi";

export default function useAddMembers(){
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState()

    const addMember = async({email , role , collId}) => {
        try {
            setloading(true);

            const response = await fetch(ADD_USER_TO_COLLECTION , {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({email , role , collId})
            })

            const res = await response.json();
            return res;
        } catch (error) {
            seterror(error.message)
        }
    }

    return {
        loading,
        error,
        addMember
    }
}