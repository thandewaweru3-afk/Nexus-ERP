import React, { useState } from 'react';
import SalesInvoicing from './components/SalesInvoicing';
import ETimsPortal from './components/ETimsPortal';
import InventoryManager from './components/InventoryManager';

function App() {
    // New state to manage which component is visible
    const [activeView, setActiveView] = useState('sales'); 
    const [lastInvoice, setLastInvoice] = useState(null);

    const handleInvoiceCreated = (invoice) => {
        setLastInvoice(invoice);
        setTimeout(() => setLastInvoice(null), 5000); 
        // Optional: Switch to the eTIMS portal after creating an invoice
        // setActiveView('etims'); 
    };

    const renderContent = () => {
        if (activeView === 'sales') {
            return <SalesInvoicing onInvoiceCreated={handleInvoiceCreated} />;
        }
        if (activeView === 'etims') {
            return <ETimsPortal />;
        }
        if (activeView === 'inventory') {
            return <InventoryManager />; 
        }
        return <div>Select a view.</div>;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f9', fontFamily: 'Arial, sans-serif' }}>
            
            <header style={{ padding: '20px', background: '#2c3e50', color: 'white', borderBottom: '3px solid #1abc9c' }}>
                <h1 style={{ margin: 0, fontSize: '1.8em' }}>Nexus ERP </h1>
                
                {/* Navigation Bar */}
                <div style={{ marginTop: '10px' }}>
                    <button 
                        onClick={() => setActiveView('sales')}
                        style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: activeView === 'sales' ? '#1abc9c' : '#34495e', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        Sales & Invoicing
                    </button>
                    <button 
                        onClick={() => setActiveView('etims')}
                        style={{ padding: '10px 15px', backgroundColor: activeView === 'etims' ? '#1abc9c' : '#34495e', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        eTIMS Portal
                    </button>
                    <button 
                        onClick={() => setActiveView('inventory')}
                        style={{ padding: '10px 15px', backgroundColor: activeView === 'inventory' ? '#1abc9c' : '#34495e', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        Inventory Manager
                    </button>
                </div>

            </header>
            
            <main style={{ padding: '20px 40px', overflow: 'auto' }}>
                {renderContent()}
            </main>
            
            {/* Notification remains the same */}
            {lastInvoice && (
                <div style={{ padding: '15px 25px', background: '#2ecc71', color: 'white', position: 'fixed', bottom: '20px', right: '20px', borderRadius: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontWeight: 'bold', zIndex: 100 }}>
                    **Success:** New Invoice **#{lastInvoice.id.substring(0, 8)}** created.
                </div>
            )}
        </div>
    );
}

export default App;