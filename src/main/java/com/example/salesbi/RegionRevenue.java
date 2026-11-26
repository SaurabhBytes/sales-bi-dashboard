package com.example.salesbi;

public class RegionRevenue {
    private String region;
    private Double revenue;

    public RegionRevenue(String region , Double revenue){
        this.region = region;
        this.revenue = revenue;
    }

    public String getRegion(){
        return region;
    }
    public Double getRevenue(){
        return revenue;
    }
    
}
