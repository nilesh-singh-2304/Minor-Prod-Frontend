import { createBrowserRouter } from "react-router-dom";
import "../index.css";
import { Children, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import { ApiTester } from "../components/shared/ApiTester";
import { Collections } from "../components/shared/Collections";
import { Header } from "../components/shared/Header";
import { RequestView } from "../components/shared/RequestView";
import Home from "../pages/Home";

const routes =  createBrowserRouter([
    {
        path: "/",
        element: (
                    <MainLayout />
                ),
        children:[
            {
                index: true,
                element: <Home/>
            },
            {
                path: "/login",
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <div>
                            Login Pagee....
                        </div>
                    </Suspense>
                )
            }
           
        ]       
    },
]);
export default routes;