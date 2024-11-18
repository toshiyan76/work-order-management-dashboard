import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">WorkFlow</h1>
            <div className="flex space-x-4">
              <Link href="/">
                <a className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location === "/" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                )}>
                  Dashboard
                </a>
              </Link>
              <Link href="/work-orders">
                <a className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location === "/work-orders" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                )}>
                  Work Orders
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
