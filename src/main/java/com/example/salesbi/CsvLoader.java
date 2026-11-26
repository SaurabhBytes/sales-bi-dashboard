package com.example.salesbi;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CsvLoader implements CommandLineRunner {

    private final SaleRepository repo;

    public CsvLoader(SaleRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) throws Exception {
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(getClass().getResourceAsStream("/sales.csv")))) {
            br.readLine(); // skip the header row
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                repo.save(new Sale(LocalDate.parse(p[0]), p[1], p[2], p[3],
                        Integer.parseInt(p[4]), Double.parseDouble(p[5])));
            }
        }
        System.out.println("Loaded " + repo.count() + " sales");
    }
}
