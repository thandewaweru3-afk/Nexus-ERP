import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/inventory';

const InventoryManager = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    
    // State for the new item form
    const [newItem, setNewItem] = useState({ 
        name: '', 
        price: 0, 
        stock: 0, 
        taxRate: 0.16 
    });

    // --- 1. Fetch Inventory ---
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_BASE_URL); // Calls GET /api/inventory
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            alert("Failed to load inventory data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // --- 2. Handle New Item Submission ---
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_BASE_URL, newItem); // Calls POST /api/inventory
            alert(`Item ${response.data.name} added successfully!`);
            setNewItem({ name: '', price: 0, stock: 0, taxRate: 0.16 });
            setIsAdding(false);
            fetchInventory(); // Refresh the list
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add new item.");
        }
    };
    
    // Simple inline handler for changing item stock (for demo)
    const handleStockUpdate = async (id, newStock) => {
        const itemToUpdate = inventory.find(i => i.id === id);
        if (!itemToUpdate) return;
        
        try {
            const updatedItemData = { ...itemToUpdate, stock: parseInt(newStock) };
            // Calls PUT /api/inventory/{id}
            await axios.put(`${API_BASE_URL}/${id}`, updatedItemData);
            
            // Optimistically update the local state
            setInventory(inv => inv.map(i => i.id === id ? updatedItemData : i));
            
            // alert(`Stock updated for ${itemToUpdate.name}`);
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Failed to update stock.");
        }
    };

    // --- Render UI ---
    return (
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h1 style={{ 
                borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#333',
                fontSize: '2.2em',
                fontFamily: 'Arial, sans-serif'
                }}>
                📦 Inventory Management
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    style={{ 
                        padding: '10px 15px', 
                        backgroundColor: '#3498db', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' , fontSize: '0.9em',
                        height: 'auto',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {isAdding ? 'Close Form' : 'Add Item'}
                </button>
            </h1>
            
            {/* New Item Form */}
            {isAdding && (
                <form onSubmit={handleAddItem} style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <input type="text" placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required style={{ flex: 1, padding: '8px' }} />
                        <input type="number" placeholder="Price (KES)" value={newItem.price} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} required style={{ width: '150px', padding: '8px' }} />
                        <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})} required style={{ width: '100px', padding: '8px' }} />
                        <select value={newItem.taxRate} onChange={e => setNewItem({...newItem, taxRate: parseFloat(e.target.value)})} style={{ width: '100px', padding: '8px' }}>
                            <option value={0.16}>16% VAT</option>
                            <option value={0.0}>0% Zero-Rated</option>
                        </select>
                        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Item</button>
                    </div>
                </form>
            )}

            {loading ? <p>Loading Inventory...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#31b8daff' }}>
                            <th style={tableHeaderStyle}>ID</th>
                            <th style={tableHeaderStyle}>Name</th>
                            <th style={tableHeaderStyle}>Price</th>
                            <th style={tableHeaderStyle}>Tax Rate</th>
                            <th style={tableHeaderStyle}>Stock</th>
                            <th style={tableHeaderStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #d6d6d6ff' }}>
                                <td style={tableCellStyle}>{item.id}</td>
                                <td style={tableCellStyle}>{item.name}</td>
                                <td style={tableCellStyle}>KES {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td style={tableCellStyle}>{item.taxRate * 100}%</td>
                                <td style={tableCellStyle}>
                                    <input 
                                        type="number" 
                                        value={item.stock} 
                                        onChange={(e) => handleStockUpdate(item.id, e.target.value)} 
                                        style={{ width: '60px', padding: '5px', textAlign: 'center' }}
                                    />
                                </td>
                                <td style={tableCellStyle}>
                                    {/* Edit and Delete actions would go here */}
                                    <span style={{ color: '#ff3d0dff', cursor: 'pointer' }}>Edit</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Basic styles for the table (can be moved to a CSS file later)
const tableHeaderStyle = { padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd', color: '#2c3e50' };
const tableCellStyle = { padding: '10px', borderRight: '1px solid #eee', color: '#333' };

export default InventoryManager;