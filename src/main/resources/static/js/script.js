
let regionChart;
let monthlyChart;
let productChart;


function getSales(region) {
    let url = '/api/sales/all';

    if (region !== 'All') {
        url = `/api/sales/by-region?region=${region}`;
    }

    return fetch(url).then(response => response.json());
}


fetch('/api/sales/count')
    .then(response => response.json())
    .then(data => {
        document.getElementById('totalSales').innerText = data;
    });

fetch('/api/sales/revenue')
    .then(response => response.json())
    .then(data => {
        document.getElementById('totalRevenue').innerText =
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(data);
    });


    Promise.all([
        fetch('/api/sales/count').then(response => response.json()),
        fetch('/api/sales/revenue').then(response => response.json())
    ])
    .then(([totalSales, totalRevenue]) => {
        const average = totalRevenue / totalSales;
    
        document.getElementById('averageRevenue').innerText =
            new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 2
            }).format(average);
    });

    fetch('/api/sales/revenue-by-product')
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            document.getElementById('topProduct').innerText =
                data[0].product;
        }
    });

    // Region Revenue
    fetch('/api/sales/revenue-by-region')
    .then(response => response.json())
    .then(data => {

        const regions = data.map(item => item.region);
        const revenues = data.map(item => item.revenue);

        regionChart = new Chart(document.getElementById('regionChart'), {
            type: 'bar',
            data: {
                labels: regions,
                datasets: [{
                    label: 'Revenue',
                    data: revenues
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });

    });
    
// Monthly Revenue

    fetch('/api/sales/revenue-by-month')
    .then(response => response.json())
    .then(data => {

        const monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];

        const months = data.map(item =>
            `${monthNames[item.month - 1]} ${item.year}`
        );

        const revenues = data.map(item => item.revenue);

        monthlyChart = new Chart(document.getElementById('monthlyChart'), {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Revenue',
                    data: revenues,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });

    });

    // Product Revenue

    fetch('/api/sales/revenue-by-product')
    .then(response => response.json())
    .then(data => {

        const products = data.map(item => item.product);
        const revenues = data.map(item => item.revenue);

        productChart = new Chart(document.getElementById('productChart'), {
            type: 'bar',
            data: {
                labels: products,
                datasets: [{
                    label: 'Revenue',
                    data: revenues
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });

    });


    Promise.all([
        fetch('/api/sales/revenue-by-region').then(response => response.json()),
        fetch('/api/sales/revenue-by-month').then(response => response.json()),
        fetch('/api/sales/revenue-by-product').then(response => response.json())
    ])
    .then(([regions, months, products]) => {
    
        const topRegion = regions.reduce((a, b) =>
            a.revenue > b.revenue ? a : b
        );
    
        const topMonth = months.reduce((a, b) =>
            a.revenue > b.revenue ? a : b
        );
    
        const topProduct = products[0];
    
        const monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];
    
        document.getElementById('insightsContainer').innerHTML = `
           <p>🏆 <strong>Top Region:</strong> ${topRegion.region} — ₹${topRegion.revenue.toLocaleString('en-IN')}</p>
            <p>📈 <strong>Best Revenue Month:</strong> ${monthNames[topMonth.month - 1]} ${topMonth.year} — ₹${topMonth.revenue.toLocaleString('en-IN')}</p>
            <p>💻 <strong>Top Product:</strong> ${topProduct.product} — ₹${topProduct.revenue.toLocaleString('en-IN')}</p>
        `;
    });


    document.getElementById('regionFilter').addEventListener('change', function() {
        const selectedRegion = this.value;
    
        getSales(selectedRegion).then(sales => {
            updateDashboard(sales);
            updateRegionChart(sales);
            updateMonthlyChart(sales);
            updateProductChart(sales);
            updateBusinessInsights(sales);
        });
    });


    function calculateRevenue(sales) {
        return sales.reduce((total, sale) => {
            return total + (sale.quantity * sale.unitPrice);
        }, 0);
    }



    function formatCurrency(value) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    }




    function updateDashboard(sales) {
        if (sales.length === 0) {
            document.getElementById('totalSales').innerText = 0;
            document.getElementById('totalRevenue').innerText = formatCurrency(0);
            document.getElementById('averageRevenue').innerText = formatCurrency(0);
            document.getElementById('topProduct').innerText = 'N/A';
            return;
        }
        const totalRevenue = calculateRevenue(sales);
        const totalSales = sales.length;
        const revenueByProduct = {};

sales.forEach(sale => {
    revenueByProduct[sale.product] =
        (revenueByProduct[sale.product] || 0) +
        (sale.quantity * sale.unitPrice);
});

const topProduct = Object.entries(revenueByProduct)
    .reduce((a, b) => a[1] > b[1] ? a : b);
    document.getElementById('topProduct').innerText = topProduct[0];
        const averageRevenue = totalSales > 0
            ? totalRevenue / totalSales
            : 0;
    
        document.getElementById('totalSales').innerText = totalSales;
    
        document.getElementById('totalRevenue').innerText =
            formatCurrency(totalRevenue);
    
        document.getElementById('averageRevenue').innerText =
            formatCurrency(averageRevenue);
    }


    function updateRegionChart(sales) {
        if (sales.length === 0) {
            regionChart.data.labels = [];
            regionChart.data.datasets[0].data = [];
            regionChart.update();
            return;
        }
        const revenueByRegion = {};

        sales.forEach(sale => {
            if (!revenueByRegion[sale.region]) {
                revenueByRegion[sale.region] = 0;
            }
        
            revenueByRegion[sale.region] += sale.quantity * sale.unitPrice;
        });
        const regions = Object.keys(revenueByRegion);
const revenues = Object.values(revenueByRegion);

regionChart.data.labels = regions;
regionChart.data.datasets[0].data = revenues;
regionChart.update();
    }



    function updateMonthlyChart(sales) {
        if (sales.length === 0) {
            monthlyChart.data.labels = [];
            monthlyChart.data.datasets[0].data = [];
            monthlyChart.update();
            return;
        }
        const revenueByMonth = {};

        sales.forEach(sale => {
            const date = new Date(sale.orderDate);
            const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
            if (!revenueByMonth[yearMonth]) {
                revenueByMonth[yearMonth] = 0;
            }
        
            revenueByMonth[yearMonth] += sale.quantity * sale.unitPrice;
        });


        const monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];
        
        const months = Object.keys(revenueByMonth).sort((a, b) => {
            return new Date(a + '-01') - new Date(b + '-01');
        });
        
        const labels = months.map(key => {
            const [year, month] = key.split('-');
            return `${monthNames[Number(month) - 1]} ${year}`;
        });
        
        const revenues = months.map(key => revenueByMonth[key]);

        monthlyChart.data.labels = labels;
monthlyChart.data.datasets[0].data = revenues;
monthlyChart.update();
    }



    function updateProductChart(sales) {
        if (sales.length === 0) {
            productChart.data.labels = [];
            productChart.data.datasets[0].data = [];
            productChart.update();
            return;
        }
        const revenueByProduct = {};

        sales.forEach(sale => {
            if (!revenueByProduct[sale.product]) {
                revenueByProduct[sale.product] = 0;
            }
        
            revenueByProduct[sale.product] += sale.quantity * sale.unitPrice;
        });

        const products = Object.keys(revenueByProduct);
const revenues = Object.values(revenueByProduct);

productChart.data.labels = products;
productChart.data.datasets[0].data = revenues;
productChart.update();
    }



    function updateBusinessInsights(sales) {
        if (sales.length === 0) {
            document.getElementById('insightsContainer').innerText =
                'No sales data available for this selection.';
            return;
        }
        const revenueByRegion = {};
        const revenueByMonth = {};
        const revenueByProduct = {};
        
        sales.forEach(sale => {
            const revenue = sale.quantity * sale.unitPrice;
        
            revenueByRegion[sale.region] =
                (revenueByRegion[sale.region] || 0) + revenue;
        
            const date = new Date(sale.orderDate);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
            revenueByMonth[monthKey] =
                (revenueByMonth[monthKey] || 0) + revenue;
        
            revenueByProduct[sale.product] =
                (revenueByProduct[sale.product] || 0) + revenue;
        });



        const topRegion = Object.entries(revenueByRegion)
    .reduce((a, b) => a[1] > b[1] ? a : b);

const topMonth = Object.entries(revenueByMonth)
    .reduce((a, b) => a[1] > b[1] ? a : b);

const topProduct = Object.entries(revenueByProduct)
    .reduce((a, b) => a[1] > b[1] ? a : b);


    const monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'
    ];
    
    const [year, month] = topMonth[0].split('-');
    
    const bestMonth = `${monthNames[Number(month) - 1]} ${year}`;



    document.getElementById('insightsContainer').innerHTML = `
    <p>🏆 <strong>Top Region:</strong> ${topRegion[0]} — ${formatCurrency(topRegion[1])}</p>
    <p>📈 <strong>Best Revenue Month:</strong> ${bestMonth} — ${formatCurrency(topMonth[1])}</p>
    <p>💻 <strong>Top Product:</strong> ${topProduct[0]} — ${formatCurrency(topProduct[1])}</p>
`;
    }