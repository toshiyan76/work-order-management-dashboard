import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "./components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import WorkOrders from "./pages/WorkOrders";
import Navigation from "./components/Navigation";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/work-orders" component={WorkOrders} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </main>
      <Toaster />
    </SWRConfig>
  </StrictMode>,
);
