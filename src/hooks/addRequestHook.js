import { useState } from "react";
import { ADD_REQUEST } from "../api/requestApi";

export default function useAddRequest(){
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();

    const addRequest = async({name , url , method , collectionId}) => {
        try {
            setloading(true);

            const response = await fetch(ADD_REQUEST , {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                credentials: "include",
                body: JSON.stringify({name , url , method , collectionId})
            })

            const res = await response.json()

            return res;
        } catch (error) {
            seterror(error.message);
        } finally{
            setloading(false)
        }
    }

    return {
        loading,
        error,
        addRequest
    }
}