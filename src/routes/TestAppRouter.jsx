import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Tester from "../pages/Tester";
import Collections from "../pages/Collections";
import Workspace from "../pages/Workspace";
import HistoryPage from "../pages/History";


export const testRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Tester /> },
      { path: "collections", element: <Collections /> },
      { path: "workspace", element: <Workspace /> },
      { path: "history", element: <HistoryPage /> },
    ],
  },
]);