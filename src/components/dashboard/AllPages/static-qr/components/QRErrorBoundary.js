import React, { Component } from 'react';

class QRErrorBoundary extends Component {
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
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('QR Component Error:', error, errorInfo);
        }
        
        // You can also log the error to an error reporting service here
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({ 
            hasError: false,
            error: null,
            errorInfo: null
        });
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="alert alert-danger m-3" role="alert">
                    <h4 className="alert-heading">
                        <i className="fa fa-exclamation-triangle mr-2"></i>
                        QR Feature Temporarily Unavailable
                    </h4>
                    <p>
                        We're experiencing technical difficulties with the QR feature. 
                        Please try again later or contact support if the issue persists.
                    </p>
                    
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="mt-3">
                            <summary>Error Details (Development Only)</summary>
                            <pre className="mt-2 p-2 bg-light">
                                {this.state.error.toString()}
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                    
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                        <button 
                            className="btn btn-primary"
                            onClick={this.handleReset}
                        >
                            <i className="fa fa-refresh mr-2"></i>
                            Try Again
                        </button>
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            <i className="fa fa-home mr-2"></i>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default QRErrorBoundary;