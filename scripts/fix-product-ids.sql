-- =====================================
-- FIX PRODUCT DISTRIBUTION DATA
-- =====================================
-- IMPORTANT: Run this in Supabase SQL Editor
-- This script will fix orders that have wrong product_id assignments
-- based on their total_price (which should match the product price)

-- Step 1: Verify current product IDs and prices
SELECT id, name, type, price FROM products ORDER BY name;

-- Step 2: Check current order distribution (before fix)
SELECT 
    p.name as product_name,
    p.price as product_price,
    COUNT(o.id) as order_count,
    SUM(o.quantity) as total_quantity
FROM orders o
LEFT JOIN products p ON o.product_id = p.id
WHERE o.status = 'COMPLETED'
GROUP BY p.name, p.price
ORDER BY order_count DESC;

-- Step 3: FIX - Update orders to have correct product_id based on price
-- Orders with total_price = 50000 should be CREDIT
UPDATE orders 
SET product_id = '675c8274-7c3e-4ff7-80a8-38cd18d188ea'  -- PIPIT AI CREDIT
WHERE total_price = 50000 
  AND product_id != '675c8274-7c3e-4ff7-80a8-38cd18d188ea';

-- Orders with total_price = 100000 should be ACCOUNT  
UPDATE orders 
SET product_id = 'd16d4b7f-492e-4f1f-93ce-29a7195be89f'  -- PIPIT AI ACCOUNT
WHERE total_price = 100000 
  AND product_id != 'd16d4b7f-492e-4f1f-93ce-29a7195be89f';

-- Step 4: Verify after fix
SELECT 
    p.name as product_name,
    p.price as product_price,
    COUNT(o.id) as order_count,
    SUM(o.quantity) as total_quantity
FROM orders o
LEFT JOIN products p ON o.product_id = p.id
WHERE o.status = 'COMPLETED'
GROUP BY p.name, p.price
ORDER BY order_count DESC;
