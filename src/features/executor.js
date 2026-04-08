import { Rss } from "lucide-react";

export const executeRequest = async({
    url,
    method,
    headers = [],
    params = [],
    body = "",
}) => {
    const startTime = performance.now();

    try {
        const queryParams = params
                            .filter((p) => p.key && p.enabled)
                            .map(
                                (p) =>`${encodeURIComponent(p.key)} = ${encodeURIComponent(p.value)}`
                            )
                            .join('&')

        const fullUrl = queryParams ? `${url}?${queryParams}` : url;

        const headersObj = {};
        headers
            .filter((h) => h.key && h.enabled)
            .forEach((h) => {
                headersObj[h.key] = h.value;
            });

        const options = {
            method,
            headers: headersObj,
            credentials: "include"
        }

        if(["POST" , "PUT" , "PATCH"].includes(method) && body?.trim()){
            options.body = body;
        }

        console.log("request body is : ", options.body);
        

        const res = await fetch(fullUrl , options);

        const endTime = performance.now();
        const time = Math.round(endTime - startTime);

        const resHeaders = {};
        res.headers.forEach((value,key) => {
            resHeaders[key] = value;
        });

        const contentType = res.headers.get("content-type");

        let data;
        if(contentType && contentType.includes("application/json")) {
            data = await res.json();
        }
        else{
            data = await res.text();
        }

        return {
            success : true,
            response: {
                status : res.status,
                statusText: res.statusText,
                data,
                ok: res.ok,
            },
            headers: resHeaders,
            time,
        }
        
    } catch (error) {
        return{
            success: false,
        response: {
            status: 0,
            statusText: "Error",
            data: {error: error.message},
            ok:false
        },
        headers: null,
        time: Math.round(performance.now() - startTime),
        }
    }

}