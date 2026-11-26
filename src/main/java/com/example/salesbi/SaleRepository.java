package com.example.salesbi;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;



public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query ("SELECT SUM(s.quantity * s.unitPrice) FROM Sale s")
    Double calculateTotalRevenue();


    @Query ("SELECT new com.example.salesbi.RegionRevenue(s.region, Sum(s.quantity * s.unitPrice))FROM Sale s GROUP BY s.region")
List<RegionRevenue> findRevenueByRegion();


    @Query ("SELECT new com.example.salesbi.MonthlyRevenue(YEAR(s.orderDate), MONTH(s.orderDate), SUM(s.quantity * s.unitPrice)) FROM Sale s GROUP BY YEAR(s.orderDate), MONTH(s.orderDate) ORDER BY YEAR(s.orderDate), MONTH(s.orderDate)")
    List<MonthlyRevenue> findMonthlyRevenue();

    @Query ("SELECT new com.example.salesbi.ProductRevenue(s.product, SUM(s.quantity * s.unitPrice)) FROM Sale s GROUP BY s.product ORDER BY SUM(s.quantity * s.unitPrice) DESC")
    List<ProductRevenue> findProductRevenue();

    List<Sale> findByRegion(String region);
}