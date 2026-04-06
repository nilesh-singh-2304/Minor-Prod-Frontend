import { useState } from "react";
import { ADD_COLLECTION, GET_COLLECTIONS } from "../api/collectionApi";

export default function useAddCollection() {
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    const [success, setsuccess] = useState(false);

    const addCollection = async({name , baseUrl}) => {
        try {
            setloading(true);
             const response = await fetch(ADD_COLLECTION , {
                 method: "POST",
                 credentials: "include",
                 headers: {
                    "Content-Type": "application/json",
                 },
                 body: JSON.stringify({name , baseUrl})
             })

            const res = await response.json();
            console.log("add coll response in hook is : " , res);
            

            setsuccess(res.success);

            return res;
        } catch (error) {
            seterror(error.message);
            setsuccess(false);
        } finally{
            setloading(false)
        }
    }


    return {
        loading,
        success,
        error,
        addCollection
    }
}