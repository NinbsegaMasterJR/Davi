import React from "react";

interface AppErrorBoundaryState {
  hasError: boolean;
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Falha inesperada no Scriptura", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="app-fallback" role="alert">
        <div>
          <p className="section-kicker">Recuperação</p>
          <h1>Algo saiu do fluxo esperado</h1>
          <p>
            Recarregue a página para retomar o workspace. Seus rascunhos salvos na
            biblioteca local permanecem no navegador.
          </p>
          <div className="app-fallback-actions">
            <button type="button" onClick={() => window.location.reload()}>
              Recarregar página
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "#/inicio";
                window.location.reload();
              }}
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </main>
    );
  }
}
