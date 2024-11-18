import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "./components/ui/toaster";
import { withErrorBoundary } from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import WorkOrders from "./pages/WorkOrders";
import Navigation from "./components/Navigation";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Wrap components with error boundary
const SafeDashboard = withErrorBoundary(Dashboard);
const SafeWorkOrders = withErrorBoundary(WorkOrders);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ 
      fetcher,
      suspense: true,
      loadingTimeout: 3000,
      onError: (error) => {
        console.error("SWR Error:", error);
      }
    }}>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={SafeDashboard} />
          <Route path="/work-orders" component={SafeWorkOrders} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </main>
      <Toaster />
    </SWRConfig>
  </StrictMode>
);
