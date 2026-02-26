-- Make all currently "draft" trips immediately "published"
UPDATE public.trips 
SET status = 'published' 
WHERE status = 'draft';

SELECT 'All draft trips are now live and visible!' AS result;
