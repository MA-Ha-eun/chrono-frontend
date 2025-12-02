import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProjectListPage } from "@/pages/projects/ProjectListPage";
import { ProjectCreatePage } from "@/pages/projects/ProjectCreatePage";
import { ProjectDetailPage } from "@/pages/projects/ProjectDetailPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // Root Layout for both Landing and App
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      {
        path: "projects",
        children: [
          { index: true, element: <ProjectListPage /> },
          { path: "new", element: <ProjectCreatePage /> },
          { path: ":id", element: <ProjectDetailPage /> },
        ],
      },
    ],
  },
]);
