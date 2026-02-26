DELETE FROM public.trips WHERE name IS NULL OR TRIM(name) = '';
SELECT 'Deleted all nameless trips' AS result;
