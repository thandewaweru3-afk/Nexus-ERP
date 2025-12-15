package com.nexus.erp_backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.nexus.erp_backend.model.Item;
import com.nexus.erp_backend.model.Invoice;
import com.nexus.erp_backend.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173"})
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/inventory")
    public List<Item> getInventory() {
        return invoiceService.getAllItems();
    }

    @PostMapping("/invoices")
    public Invoice createNewInvoice(@RequestBody List<Item> cartItems) {
        return invoiceService.createInvoice(cartItems);
    }

    @GetMapping("/invoices")
    public List<Invoice> getInvoiceQueue() {
        return invoiceService.getInvoiceQueue();
    }

    @PutMapping("/invoices/{id}/transmit")
    public Invoice transmitInvoice(@PathVariable String id) {
        try {
            return invoiceService.simulateTransmission(id);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }

}
