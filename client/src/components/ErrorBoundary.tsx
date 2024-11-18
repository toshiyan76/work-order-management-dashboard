import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { AlertCircle } from "lucide-react";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-destructive/10 rounded-lg border border-destructive/20">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ReactErrorBoundary FallbackComponent={fallback || ErrorFallback}>
        <Component {...props} />
      </ReactErrorBoundary>
    );
  };
}

export default ErrorFallback;
