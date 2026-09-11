import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel p-8 rounded-2xl border border-red-500/40 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Bir Hata Meydana Geldi</h2>
          <p className="text-xs text-slate-300">
            Sayfayı yenileyerek veya aşağıdaki butona tıklayarak işlemi sıfırlayabilirsiniz.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
