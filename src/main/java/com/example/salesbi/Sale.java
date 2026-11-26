package com.example.salesbi;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;

@Entity
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate orderDate;
    private String region;
    private String product;
    private String category;
    private int quantity;
    private double unitPrice;

    public Sale() {}

    public Sale(LocalDate orderDate, String region, String product,
                String category, int quantity, double unitPrice) {
        this.orderDate = orderDate;
        this.region = region;
        this.product = product;
        this.category = category;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getId() { return id; }
    public LocalDate getOrderDate() { return orderDate; }
    public String getRegion() { return region; }
    public String getProduct() { return product; }
    public String getCategory() { return category; }
    public int getQuantity() { return quantity; }
    public double getUnitPrice() { return unitPrice; }
}
