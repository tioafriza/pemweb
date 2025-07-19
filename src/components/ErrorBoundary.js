import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log the error to an error reporting service here
        this.logErrorToService(error, errorInfo);
    }

    logErrorToService = (error, errorInfo) => {
        // In a real app, you would send this to your error tracking service
        console.log('Logging error to service:', {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString()
        });
    };

    handleRetry = () => {
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null 
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-container">
                        <h2>🚨 Oops! Terjadi Kesalahan</h2>
                        <p>Aplikasi mengalami error yang tidak terduga. Silakan coba lagi atau hubungi administrator.</p>
                        
                        <div className="error-actions">
                            <button 
                                onClick={this.handleRetry}
                                className="retry-btn"
                            >
                                🔄 Coba Lagi
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="reload-btn"
                            >
                                🔃 Reload Halaman
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="error-details">
                                <summary>Detail Error (Development Mode)</summary>
                                <div className="error-info">
                                    <h4>Error Message:</h4>
                                    <pre>{this.state.error && this.state.error.toString()}</pre>
                                    
                                    <h4>Component Stack:</h4>
                                    <pre>{this.state.errorInfo.componentStack}</pre>
                                    
                                    <h4>Error Stack:</h4>
                                    <pre>{this.state.error && this.state.error.stack}</pre>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
