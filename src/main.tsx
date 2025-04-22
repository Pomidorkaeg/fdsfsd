import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error boundary for the entire app
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Critical app error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl font-semibold text-red-600">Критическая ошибка</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-fc-green text-white rounded-md hover:bg-fc-darkGreen transition-colors"
            >
              Перезагрузить приложение
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the app with improved error handling and loading state management
const init = async () => {
  try {
    // Remove the loading indicator from index.html
    const loadingEl = document.querySelector('.loading');
    if (loadingEl?.parentNode) {
      loadingEl.parentNode.removeChild(loadingEl);
    }

    const root = document.getElementById('root');
    if (!root) {
      throw new Error('Root element not found');
    }

    // Clear any stale data from previous sessions
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.body.innerHTML = `
      <div class="flex h-screen w-full items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <p class="text-xl font-semibold text-red-600">Ошибка инициализации</p>
          <button 
            onclick="window.location.reload()" 
            class="px-4 py-2 bg-[#2e7d32] text-white rounded-md hover:bg-[#1b5e20] transition-colors"
          >
            Перезагрузить страницу
          </button>
        </div>
      </div>
    `;
  }
};

init().catch(console.error);
