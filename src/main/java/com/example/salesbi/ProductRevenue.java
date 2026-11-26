package com.example.salesbi;

public class ProductRevenue {

    private String product;
    private Double revenue;

    public ProductRevenue(String product, Double revenue) {
        this.product = product;
        this.revenue = revenue;
    }

    public String getProduct() {
        return product;
    }

    public Double getRevenue() {
        return revenue;
    }
}