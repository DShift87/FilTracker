import { createBrowserRouter, Navigate, Link, Outlet, useLocation } from "react-router";
import { AddActionProvider } from "@/app/context/AddActionContext";
import { MobileLayout } from "@/app/components/MobileLayout";
import { Dashboard } from "@/app/pages/Dashboard";
import { Filaments } from "@/app/pages/Filaments";
import { FilamentDetail } from "@/app/pages/FilamentDetail";
import { PrintedParts } from "@/app/pages/PrintedParts";
import { PrintedPartDetail } from "@/app/pages/PrintedPartDetail";
import { ProjectDetail } from "@/app/pages/ProjectDetail";
import { Stats } from "@/app/pages/Stats";
import { Button } from "@/app/components/ui/button";

const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // match Vite base, no trailing slash

function NotFound() {
  const location = useLocation();
  const path = location.pathname.replace(base, "") || "/";
  if (path === "/" || path === "") {
    return <Navigate to="/" replace />;
  }
  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-4 text-center"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">This page doesn’t exist or was moved.</p>
      <Button asChild>
        <Link to="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-4 text-center"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">We couldn’t load this page.</p>
      <Button asChild>
        <Link to="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: "",
      element: <Navigate to="/" replace />,
    },
    {
      path: "/",
      element: (
        <AddActionProvider>
          <Outlet />
        </AddActionProvider>
      ),
      errorElement: <ErrorFallback />,
      children: [
        {
          index: true,
          Component: () => (
            <MobileLayout>
              <Dashboard />
            </MobileLayout>
          ),
        },
        {
          path: "filaments",
          Component: () => (
            <MobileLayout>
              <Filaments />
            </MobileLayout>
          ),
        },
        {
          path: "filaments/:id",
          Component: () => <FilamentDetail />,
        },
        {
          path: "parts",
          Component: () => (
            <MobileLayout>
              <PrintedParts />
            </MobileLayout>
          ),
        },
        {
          path: "parts/project/:projectId",
          Component: () => <ProjectDetail />,
        },
        {
          path: "parts/:id",
          Component: () => <PrintedPartDetail />,
        },
        {
          path: "stats",
          Component: () => (
            <MobileLayout>
              <Stats />
            </MobileLayout>
          ),
        },
        {
          path: "*",
          Component: NotFound,
        },
      ],
    },
  ],
  { basename: base, future: { v7_startTransition: true } }
);