import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="glass rounded-2xl p-8 max-w-md text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">{this.state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
