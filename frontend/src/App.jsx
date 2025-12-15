// src/App.jsx

import React, { useState } from 'react';
import SalesInvoicing from './components/SalesInvoicing';
// Import ETimsPortal when you create it later

function App() {
    // State to hold the most recent invoice (for the success notification)
    const [lastInvoice, setLastInvoice] = useState(null);
    // In a full ERP, you would manage activeView here (e.g., 'sales', 'etims')

    const handleInvoiceCreated = (invoice) => {
        setLastInvoice(invoice);
        // Set a timeout to clear the notification after 5 seconds
        setTimeout(() => setLastInvoice(null), 5000); 
    };

    return (
        // Global styling: light background, full height
        <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f9', fontFamily: 'Arial, sans-serif' }}>
            
            {/* Header: Dark Blue/Slate with Green Accent */}
            <header style={{ 
                padding: '20px', 
                background: '#2c3e50', 
                color: 'white', 
                borderBottom: '3px solid #1abc9c' 
            }}>
                <h1 style={{ margin: 0, fontSize: '1.8em' }}>Nexus ERP - Sales & Invoicing</h1>
            </header>
            
            {/* Main Content Area */}
            <main style={{ 
                padding: '20px 40px', 
                overflow: 'auto' 
            }}>
                {/* Renders the core sales component */}
                <SalesInvoicing onInvoiceCreated={handleInvoiceCreated} />
            </main>
            
            {/* Fixed Success Notification (Toast) */}
            {lastInvoice && (
                <div style={{ 
                    padding: '15px 25px', 
                    background: '#2ecc71', // Bright Success Green
                    color: 'white', 
                    position: 'fixed', 
                    bottom: '20px', 
                    right: '20px', 
                    borderRadius: '5px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    fontWeight: 'bold',
                    zIndex: 100
                }}>
                    **Success:** New Invoice **#{lastInvoice.id.substring(0, 8)}** created. Ready for eTIMS fiscalization!
                </div>
            )}
        </div>
    );
}

export default App;