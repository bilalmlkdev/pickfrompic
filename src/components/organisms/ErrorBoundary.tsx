import React from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Button from "../atoms/Button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  handleGoBack = () => {
    this.setState({ hasError: false, error: null });
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-sm">
            <div className="text-[100px] font-bold text-foreground/5 leading-none select-none mb-2">
              !
            </div>
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-muted-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1.5">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              An unexpected error occurred. Try going back or reloading the page.
            </p>
            {this.state.error && (
              <div className="bg-muted border border-border rounded-xl p-3 mb-5 text-left">
                <p className="text-[11px] font-mono text-muted-foreground break-all leading-relaxed">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-2.5 justify-center">
              <Button
                variant="secondary"
                size="md"
                icon={<ArrowLeft size={14} />}
                onClick={this.handleGoBack}
              >
                Go back
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={<Home size={14} />}
                onClick={this.handleGoHome}
              >
                Home
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<RefreshCw size={14} />}
                onClick={this.handleReload}
              >
                Reload
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
