package com.example.salesbi;



import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;



import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class SaleRepositoryTest {

    @Autowired
    private SaleRepository saleRepository;

    @BeforeEach
    void setUp() {
        saleRepository.deleteAll();

        saleRepository.saveAll(List.of(
            new Sale(LocalDate.of(2026, 1, 5), "North",
                "Laptop", "Computers", 2, 1000),

            new Sale(LocalDate.of(2026, 1, 12), "North",
                "Phone", "Mobiles", 1, 500),

            new Sale(LocalDate.of(2026, 2, 5), "South",
                "Laptop", "Computers", 3, 1000),

            new Sale(LocalDate.of(2026, 2, 12), "South",
                "Keyboard", "Accessories", 4, 100)
        ));
    }

    @Test
    void shouldCalculateTotalRevenue() {
        Double revenue = saleRepository.calculateTotalRevenue();

        assertEquals(5900.0, revenue, 0.01);
    }

    @Test
    void shouldFindSalesByRegion() {
        List<Sale> northSales = saleRepository.findByRegion("North");

        assertEquals(2, northSales.size());
    }

    @Test
    void shouldCalculateRevenueByRegion() {
        List<RegionRevenue> results =
            saleRepository.findRevenueByRegion();

        Map<String, Double> revenueByRegion =
            results.stream().collect(Collectors.toMap(
                RegionRevenue::getRegion,
                RegionRevenue::getRevenue
            ));

        assertEquals(2500.0, revenueByRegion.get("North"), 0.01);
        assertEquals(3400.0, revenueByRegion.get("South"), 0.01);
    }

    @Test
    void shouldCalculateMonthlyRevenue() {
        List<MonthlyRevenue> results =
            saleRepository.findMonthlyRevenue();

        assertEquals(2, results.size());

        assertEquals(2026, results.get(0).getYear());
        assertEquals(1, results.get(0).getMonth());
        assertEquals(2500.0, results.get(0).getRevenue(), 0.01);

        assertEquals(2026, results.get(1).getYear());
        assertEquals(2, results.get(1).getMonth());
        assertEquals(3400.0, results.get(1).getRevenue(), 0.01);
    }

    @Test
    void shouldRankProductsByRevenue() {
        List<ProductRevenue> results =
            saleRepository.findProductRevenue();

        assertEquals(3, results.size());

        assertEquals("Laptop", results.get(0).getProduct());
        assertEquals(5000.0, results.get(0).getRevenue(), 0.01);

        assertEquals("Phone", results.get(1).getProduct());
        assertEquals("Keyboard", results.get(2).getProduct());
    }
}
