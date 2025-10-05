// Sample data for testing PDF exports

export const sampleSalesData = [
  {
    product: 'Laptop Pro X1',
    quantity: 15,
    unitPrice: 1299.99,
    amount: 19499.85,
    date: '2024-10-01'
  },
  {
    product: 'Wireless Mouse',
    quantity: 45,
    unitPrice: 29.99,
    amount: 1349.55,
    date: '2024-10-02'
  },
  {
    product: 'USB-C Hub',
    quantity: 30,
    unitPrice: 79.99,
    amount: 2399.70,
    date: '2024-10-03'
  },
  {
    product: 'Monitor 4K',
    quantity: 8,
    unitPrice: 399.99,
    amount: 3199.92,
    date: '2024-10-04'
  },
  {
    product: 'Mechanical Keyboard',
    quantity: 25,
    unitPrice: 149.99,
    amount: 3749.75,
    date: '2024-10-05'
  }
];

export const sampleInventoryData = [
  {
    name: 'Laptop Pro X1',
    sku: 'LPX1-2024',
    stock: 45,
    minStock: 20,
    lastUpdated: '2024-10-05'
  },
  {
    name: 'Wireless Mouse',
    sku: 'WM-BT-001',
    stock: 12,
    minStock: 25,
    lastUpdated: '2024-10-05'
  },
  {
    name: 'USB-C Hub',
    sku: 'UCH-7P-001',
    stock: 78,
    minStock: 30,
    lastUpdated: '2024-10-04'
  },
  {
    name: 'Monitor 4K',
    sku: 'MON-4K-27',
    stock: 5,
    minStock: 10,
    lastUpdated: '2024-10-05'
  },
  {
    name: 'Mechanical Keyboard',
    sku: 'MK-RGB-001',
    stock: 35,
    minStock: 15,
    lastUpdated: '2024-10-03'
  },
  {
    name: 'Webcam HD',
    sku: 'WC-HD-PRO',
    stock: 3,
    minStock: 20,
    lastUpdated: '2024-10-05'
  }
];

export const sampleFinancialData = {
  period: 'Q3 2024',
  revenue: 125000,
  expenses: 87500,
  revenueBreakdown: [
    { category: 'Product Sales', amount: 95000 },
    { category: 'Services', amount: 20000 },
    { category: 'Licensing', amount: 10000 }
  ],
  expenseBreakdown: [
    { category: 'Cost of Goods', amount: 45000 },
    { category: 'Marketing', amount: 15000 },
    { category: 'Operations', amount: 12500 },
    { category: 'Personnel', amount: 10000 },
    { category: 'Other', amount: 5000 }
  ]
};