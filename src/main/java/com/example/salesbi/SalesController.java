package com.example.salesbi;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;






@RestController 
public class SalesController {
   
    private final SaleRepository repo;

    public SalesController(SaleRepository repo){
        this.repo = repo;
    }

    @GetMapping("/api/sales/count")
    public long count(){
        return repo.count();
    }

    @GetMapping("/api/sales/revenue")
    public Double totalRevenue() {
        return repo.calculateTotalRevenue();
    }

    @GetMapping("/api/sales/revenue-by-region")
    public List<RegionRevenue> revenueByRegion(){
        return repo.findRevenueByRegion();
    }

    @GetMapping("/api/sales/revenue-by-month")
    public List<MonthlyRevenue> revenueByMonth(){
        return repo.findMonthlyRevenue();
    }

    @GetMapping("/api/sales/revenue-by-product")
    public List<ProductRevenue> revenueByProduct() {
        return repo.findProductRevenue();
    }
    
    @GetMapping("/api/sales/by-region")
    public List<Sale> salesByRegion(@RequestParam String region) {
    return repo.findByRegion(region);
}

    @GetMapping("/api/sales/all")
    public List<Sale> getAllSales() {
    return repo.findAll();
}
    
}


