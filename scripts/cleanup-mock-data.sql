-- =====================================================
-- CLEANUP MOCK DATA SCRIPT
-- =====================================================
-- This script removes any mock data from the database
-- Run this script to ensure a clean production database

-- Delete any mock users (excluding real admin users)
DELETE FROM users 
WHERE email NOT IN ('abathwabiz@gmail.com', 'admin@abathwa.com')
AND (
  full_name ILIKE '%mock%' 
  OR full_name ILIKE '%test%' 
  OR full_name ILIKE '%demo%'
  OR full_name ILIKE '%sarah%'
  OR full_name ILIKE '%john%'
  OR full_name ILIKE '%doe%'
  OR full_name ILIKE '%chen%'
  OR email ILIKE '%test%'
  OR email ILIKE '%mock%'
  OR email ILIKE '%demo%'
);

-- Delete any mock opportunities
DELETE FROM opportunities 
WHERE title ILIKE '%mock%' 
   OR title ILIKE '%test%' 
   OR title ILIKE '%demo%'
   OR description ILIKE '%mock%'
   OR description ILIKE '%test%'
   OR description ILIKE '%demo%';

-- Delete any mock transactions
DELETE FROM transactions 
WHERE reference_number ILIKE '%MOCK%'
   OR reference_number ILIKE '%TEST%'
   OR reference_number ILIKE '%DEMO%';

-- Delete any mock investment pools
DELETE FROM investment_pools 
WHERE name ILIKE '%mock%' 
   OR name ILIKE '%test%' 
   OR name ILIKE '%demo%'
   OR description ILIKE '%mock%'
   OR description ILIKE '%test%'
   OR description ILIKE '%demo%';

-- Delete any mock investment offers
DELETE FROM investment_offers 
WHERE id IN (
  SELECT io.id 
  FROM investment_offers io
  JOIN opportunities o ON io.opportunity_id = o.id
  WHERE o.title ILIKE '%mock%' 
     OR o.title ILIKE '%test%' 
     OR o.title ILIKE '%demo%'
);

-- Delete any mock documents
DELETE FROM documents 
WHERE title ILIKE '%mock%' 
   OR title ILIKE '%test%' 
   OR title ILIKE '%demo%';

-- Delete any mock pool members (for mock pools)
DELETE FROM pool_members 
WHERE pool_id IN (
  SELECT id FROM investment_pools 
  WHERE name ILIKE '%mock%' 
     OR name ILIKE '%test%' 
     OR name ILIKE '%demo%'
);

-- Delete any mock service providers
DELETE FROM service_providers 
WHERE service_type ILIKE '%mock%' 
   OR service_type ILIKE '%test%' 
   OR service_type ILIKE '%demo%';

-- Delete any mock service requests
DELETE FROM service_requests 
WHERE title ILIKE '%mock%' 
   OR title ILIKE '%test%' 
   OR title ILIKE '%demo%'
   OR description ILIKE '%mock%'
   OR description ILIKE '%test%'
   OR description ILIKE '%demo%';

-- Delete any mock observers
DELETE FROM observers 
WHERE id IN (
  SELECT o.id 
  FROM observers o
  JOIN users u ON o.observer_id = u.id
  WHERE u.full_name ILIKE '%mock%' 
     OR u.full_name ILIKE '%test%' 
     OR u.full_name ILIKE '%demo%'
);

-- Delete any mock agreements
DELETE FROM agreements 
WHERE title ILIKE '%mock%' 
   OR title ILIKE '%test%' 
   OR title ILIKE '%demo%';

-- Delete any mock audit logs
DELETE FROM audit_logs 
WHERE action ILIKE '%mock%' 
   OR action ILIKE '%test%' 
   OR action ILIKE '%demo%';

-- Reset sequences if needed (PostgreSQL)
-- SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
-- SELECT setval('opportunities_id_seq', (SELECT MAX(id) FROM opportunities));
-- SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions));

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check remaining users
SELECT COUNT(*) as total_users FROM users;

-- Check remaining opportunities
SELECT COUNT(*) as total_opportunities FROM opportunities;

-- Check remaining transactions
SELECT COUNT(*) as total_transactions FROM transactions;

-- Check remaining pools
SELECT COUNT(*) as total_pools FROM investment_pools;

-- =====================================================
-- END OF CLEANUP SCRIPT
-- ===================================================== 