import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ProSidebarProvider } from 'react-pro-sidebar';

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Journal from "./pages/Journal";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";
import MentalHealthSurvey from "./pages/Survey";
import LandingPage from "./pages/Landing page";

import SidebarComponent from "./components/Sidebar";

// Layout WITH Sidebar
const AppLayout = () => {
  return (
    <div className="flex min-h-screen gap-2">
      <ProSidebarProvider>
        <SidebarComponent />
      </ProSidebarProvider>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

// Layout WITHOUT Sidebar
const BasicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
};

// Router
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <BasicLayout />, // No sidebar for these
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/",
    element: <AppLayout />, // Sidebar layout
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/journal",
        element: <Journal />,
      },
      {
        path: "/chatbot",
        element: <Chatbot />,
      },
      {
        path: "/survey",
        element: <MentalHealthSurvey />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
