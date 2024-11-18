import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold font-game bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">QuestFlow</h1>
            <div className="flex space-x-4">
              <Link href="/">
                <span className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                  location === "/" ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-800"
                )}>
                  Dashboard
                </span>
              </Link>
              <Link href="/work-orders">
                <span className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                  location === "/work-orders" ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-800"
                )}>
                  Quest Board
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
