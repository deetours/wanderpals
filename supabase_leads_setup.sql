-- 1. Create LEADS table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    full_name TEXT,
    email TEXT,
    phone_number TEXT,
    message TEXT,
    source TEXT DEFAULT 'direct', -- e.g. 'whatsapp', 'website_form', 'booking_inquiry'
    status TEXT DEFAULT 'new', -- e.g. 'new', 'contacted', 'interested', 'converted', 'lost'
    notes TEXT,
    trip_interest TEXT, -- ID or name of the trip they are interested in
    stay_interest TEXT, -- ID or name of the stay they are interested in
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone to INSERT (so guests can submit forms)
CREATE POLICY "Allow public insert to leads" 
ON public.leads FOR INSERT 
WITH CHECK (true);

-- 4. Policy: Allow ADMINS to SELECT/UPDATE/DELETE
CREATE POLICY "Allow admins full access to leads"
ON public.leads FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 5. Grant permissions to anon and authenticated roles
GRANT ALL ON public.leads TO postgres, service_role;
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;

-- Index for searching
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_phone_idx ON public.leads (phone_number);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
