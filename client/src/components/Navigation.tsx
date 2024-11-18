import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorBoundary";

function NavigationContent() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-xl font-bold font-game bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent hover:opacity-90 transition-all"
          >
            はちぽ荘クエストボード
          </Link>
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location === "/" 
                  ? "bg-primary/20 text-primary hover:bg-primary/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              ダッシュボード
            </Link>
            <Link 
              href="/work-orders" 
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location === "/work-orders" 
                  ? "bg-primary/20 text-primary hover:bg-primary/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              ワークオーダー
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Navigation() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <NavigationContent />
    </ErrorBoundary>
  );
}
