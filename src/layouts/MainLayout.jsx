import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      

      {/* Page Content */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;