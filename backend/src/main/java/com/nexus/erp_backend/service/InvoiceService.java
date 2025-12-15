package com.nexus.erp_backend.service;

import com.nexus.erp_backend.model.Item;
import com.nexus.erp_backend.model.Invoice;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class InvoiceService {
    // Mock Inventory Database (In a real app, this would use JPA/Repository)
    private final List<Item> inventory = List.of(
    new Item("ITM-001", "Laptop", 1000.0, 0.16, 10),
    new Item("ITM-002", "Smartphone", 500.0, 0.16, 20),
    new Item("ITM-003", "Tablet", 300.0, 0.16, 15)
    );

    private final List<Invoice> invoiceQueue =  new ArrayList<>();

    public List<Item> getAllItems() {
        return inventory;
    }

    // This method simulates creating a new invoice from the sales cart
    public Invoice createInvoice(List<Item> cartItems) {
        double subtotal = cartItems.stream().mapToDouble(i -> i.getPrice() * i.getStock()).sum();
        double taxAmount = cartItems.stream().mapToDouble(i -> i.getPrice() * i.getStock() * i.getTaxRate()).sum();
        double totalAmount = subtotal + taxAmount;

        Invoice newInvoice =  new Invoice();
        newInvoice.setId(UUID.randomUUID().toString());
        newInvoice.setDate(LocalDateTime.now());
        newInvoice.setSubtotal(subtotal);
        newInvoice.setTaxAmount(taxAmount);
        newInvoice.setTotalAmount(totalAmount);
        newInvoice.setStatus("Pending");

        // Simulating Line items from the cart items
        newInvoice.setLineItems(cartItems.stream().map(i -> i.getName() + " x " + i.getStock()).toList());

        invoiceQueue.add(0, newInvoice); //add to queue
        return newInvoice;
    }

    public List<Invoice> getInvoiceQueue() {
        return invoiceQueue;
    }

}
