// src/components/SalesInvoicing.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const SalesInvoicing = ({ onInvoiceCreated }) => {
    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);
    const [customerPin, setCustomerPin] = useState('P001234567X'); // Mock customer PIN
    const [loading, setLoading] = useState(false);

    // --- 1. Fetch Inventory Data (on component mount) ---
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/inventory`);
                setInventory(response.data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
                alert("Failed to load inventory from Java backend.");
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    // --- 2. Cart Operations ---
    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.id === item.id);
            if (existingItem) {
                return prevCart.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prevCart, {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    taxRate: item.taxRate,
                    quantity: 1 
                }];
            }
        });
    };

    const removeItemFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    // --- 3. Calculation Logic ---
    const calculateTotals = () => {
        let subtotal = 0;
        let taxAmount = 0;
        
        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            taxAmount += itemSubtotal * item.taxRate;
        });

        const total = subtotal + taxAmount;
        return { subtotal, taxAmount, total };
    };

    const { subtotal, taxAmount, total } = calculateTotals();

    // --- 4. Process Invoice (POST to Java Backend) ---
    const processInvoice = async () => {
        if (cart.length === 0) {
            alert("Cart is empty. Please add items.");
            return;
        }

        try {
            setLoading(true);
            
            // Map cart items to the expected Java Item structure
            const payload = cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                taxRate: item.taxRate,
                stock: item.quantity, // Java backend uses 'stock' as quantity
            }));

            // Call Java POST /api/invoices
            const response = await axios.post(`${API_BASE_URL}/invoices`, payload);
            
            setCart([]); // Clear the cart after success
            onInvoiceCreated(response.data); // Trigger notification in App.jsx
            
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Invoice creation failed. Check Java server console for details.");
        } finally {
            setLoading(false);
        }
    };

    // --- Render UI ---
    return (
        // Grid Layout: 2 parts for Catalog (2fr) and Cart (1fr)
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr', 
            gap: '30px',
            //maxWidth: '1400px', 
            //margin: '0 auto'
        }}>
            
            {/* LEFT: Product Catalog */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.5em' }}>
                    🛍️ Product Catalog
                </h2>
                {loading ? <p>Loading Inventory...</p> : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        {inventory.map((item) => (
                            <button 
                                key={item.id} 
                                onClick={() => addToCart(item)}
                                style={{ 
                                    flex: '0 0 calc(33.333% - 10px)', // 3 items per row
                                    minWidth: '150px',
                                    padding: '15px 10px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer', 
                                    backgroundColor: '#ecf0f1', 
                                    color: '#2c3e50', 
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1abc9c'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ecf0f1'}
                            >
                                <span style={{ fontSize: '1.1em' }}>{item.name}</span><br />
                                KES {item.price.toLocaleString()} ({item.taxRate * 100}%)
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: Invoice Builder/Cart */}
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                color: '#333',
                overflowY: 'auto' }}>
                <h2 style={{ 
                    borderBottom: '1px solid #eee', 
                    paddingBottom: '10px', 
                    marginBottom: '20px', 
                    fontSize: '1.5em' }}>
                    🛒 Invoice Builder
                </h2>
                
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Customer PIN:</p>
                <input type="text" value={customerPin} readOnly style={{ 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    width: '90%', 
                    marginBottom: '15px',
                    borderRadius: '4px',
                    color: '#333',
                    background: '#e2e1e1ff' }} />

                <h3>Cart Items:</h3>
                <ul style={{ 
                    listStyle: 'none', 
                    padding: '10px', 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    // ENSURE LIST ITEMS ARE VISIBLE
                    color: '#333' // Explicitly set text color to dark gray
                }}>
                    {cart.map((item, index) => (
                        <li key={item.id + index} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            padding: '8px 0', 
                            borderBottom: '1px dotted #ccc',
                            // Ensure the quantity and name are visible
                            color: '#333' 
                        }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span style={{ minWidth: '80px', textAlign: 'right' }}>KES {(item.price * item.quantity).toLocaleString()}</span>
                            {/* Make the remove button red for visibility */}
                            <button onClick={() => removeItemFromCart(item.id)} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                        </li>
                    ))}
                    {cart.length === 0 && <li style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Cart is empty.</li>}
                </ul>

                <hr style={{ margin: '15px 0', borderColor: '#eee' }}/>
                
                {/* Totals Display */}
                <div style={{ fontSize: '1.1em', padding: '10px 0' }}>
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span> <strong>KES {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></p>
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax (VAT):</span> <strong>KES {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></p>
                    <hr style={{ margin: '10px 0', borderColor: '#34495e' }}/>
                    <h3 style={{ color: '#c0392b', display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                        <span>TOTAL:</span> KES {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <button 
                    onClick={processInvoice}
                    disabled={cart.length === 0 || loading}
                    style={{ 
                        padding: '12px 20px', 
                        backgroundColor: '#2ecc71', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        marginTop: '20px',
                        width: '100%',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#27ae60'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#2ecc71'}
                >
                    {loading ? 'Processing...' : 'Process Invoice'}
                </button>
            </div>
        </div>
    );
};

export default SalesInvoicing;