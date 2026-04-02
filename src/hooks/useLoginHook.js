import { useState } from "react";
import { LOGIN } from "../api/userApi";


export default function useLoginHook () {
    const [Loading, setLoading] = useState(false);
    const [error, seterror] = useState();
    const [success, setsuccess] = useState();
    const [data, setdata] = useState();

    const useLogin = async({email , password}) => {
        try {
            setLoading(true);

            const response = await fetch(LOGIN , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({email,password})
            });

            const res = await response.json();
            setsuccess(res.success);
            // setdata(res?.data?.user);

            return res;
        } catch (error) {
            seterror(error.message);
        } finally{
            setLoading(false)
        }
    }


    return{
        Loading,
        error,
        success,
        // data,
        useLogin
    }
}