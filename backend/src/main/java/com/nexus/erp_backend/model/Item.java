package com.nexus.erp_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@AllArgsConstructor
public class Item {
    @Id
    private String id; // eg ITM-001
    private String name;
    private double price;
    private double taxRate; // 0.16 for 16% VAT
    private int stock;
}
