package com.nexus.erp_backend.model;

import lombok.Data;
import java.util.List;

import jakarta.annotation.Generated;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;


@Data
@Entity
public class Invoice {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private String id;
    private LocalDateTime date;
    private String customerPin;
    private double subtotal;
    private double taxAmount;
    private double totalAmount;
    private String status;  // "Pending", "Verified"
    private String etimsReceiptLabel;

    // Line items stored as JSON/String in H2 for simplicity
    @ElementCollection
    private List<String> lineItems;
}