// src/components/ETimsPortal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/invoices';

const ETimsPortal = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Fetch the list of invoices (the eTIMS queue)
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_BASE_URL); // Calls GET /api/invoices
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoice queue:", error);
            alert("Failed to load eTIMS queue from Java backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
        // Set up an auto-refresh every 10 seconds to update status
        const interval = setInterval(fetchInvoices, 10000); 
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Handle the transmission (fiscalization) request
    const handleTransmit = async (invoiceId) => {
        // 1. Optimistic Update (Better UX while waiting for server response)
        setInvoices(prev => prev.map(inv => 
            inv.id === invoiceId ? { ...inv, status: 'Transmitting...' } : inv
        ));

        try {
            // 2. Call the Java PUT endpoint
            const response = await axios.put(`${API_BASE_URL}/${invoiceId}/transmit`);
            
            // 3. Final Update with verified data from the server
            setInvoices(prev => prev.map(inv => 
                inv.id === invoiceId ? response.data : inv
            ));
            
        } catch (error) {
            console.error("Transmission failed:", error);
            alert("Failed to connect to KRA OSCU. Check server logs.");
            fetchInvoices(); // Revert on failure
        }
    };

    // Helper to style the status badge
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { backgroundColor: '#f39c12', color: 'white' }; // Orange
            case 'Transmitting...': return { backgroundColor: '#3498db', color: 'white' }; // Blue
            case 'Verified': return { backgroundColor: '#2ecc71', color: 'white' }; // Green
            default: return { backgroundColor: '#bdc3c7', color: '#333' };
        }
    };

    return (
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                📜 eTIMS Compliance Portal
            </h1>
            
            {loading && <p>Loading Invoice Queue...</p>}

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {invoices.length === 0 ? (
                    <p>No invoices in the queue yet. Process sales first.</p>
                ) : (
                    invoices.map((inv) => (
                        <div key={inv.id} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '15px', 
                            borderBottom: '1px solid #f4f4f4',
                            color: '#070707'
                        }}>
                            
                            {/* Invoice Details */}
                            <div style={{ flex: 1 }}>
                                <strong>Invoice ID: #{inv.id.substring(0, 8)}</strong>
                                <span style={{ marginLeft: '20px', fontSize: '0.9em', color: '#7f8c8d' }}>
                                    Total: KES {inv.totalAmount ? inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                                </span>
                            </div>

                            {/* Status Badge */}
                            <span style={{ 
                                padding: '5px 10px', 
                                borderRadius: '3px', 
                                fontWeight: 'bold', 
                                fontSize: '0.8em',
                                ...getStatusStyle(inv.status)
                            }}>
                                {inv.status}
                            </span>

                            {/* Action Button */}
                            <div style={{ width: '150px', textAlign: 'right' }}>
                                {inv.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleTransmit(inv.id)}
                                        style={{ padding: '8px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Transmit
                                    </button>
                                )}
                                {inv.status === 'Verified' && (
                                    <span style={{ color: '#2ecc71', fontSize: '0.9em' }}>
                                        {inv.etimsReceiptLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ETimsPortal;