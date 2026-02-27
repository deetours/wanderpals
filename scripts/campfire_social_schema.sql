-- WANDERPALS SOCIAL "CAMPFIRE" SCHEMA UPDATE
-- Run this in your Supabase SQL Editor to enable Trip Memory comments and likes

-- ═══ 1. MEMORY LIKES ═══
-- This prevents a single user from liking the same memory multiple times.

CREATE TABLE IF NOT EXISTS public.memory_likes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    memory_id uuid NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Unique constraint ensures one like per user per memory
    UNIQUE(memory_id, user_id)
);

-- RLS Policies for Likes
ALTER TABLE public.memory_likes ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view all likes
CREATE POLICY "Authenticated users can view memory likes"
    ON public.memory_likes FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated users can toggle their own likes"
    ON public.memory_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Authenticated users can remove their own likes
CREATE POLICY "Authenticated users can remove their own likes"
    ON public.memory_likes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);


-- ═══ 2. MEMORY COMMENTS ═══

CREATE TABLE IF NOT EXISTS public.memory_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    memory_id uuid NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for Comments
ALTER TABLE public.memory_comments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view comments
CREATE POLICY "Authenticated users can view memory comments"
    ON public.memory_comments FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated users can post comments
CREATE POLICY "Authenticated users can post comments"
    ON public.memory_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments, Admins can delete any
CREATE POLICY "Users can delete own comments"
    ON public.memory_comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);


-- ═══ 3. QUICK MEMORIES TABLE FIX (If needed) ═══
-- Ensure the memories table actually has a user_id tied to auth schema
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage
        WHERE table_name = 'memories'  AND column_name = 'user_id'
    ) THEN
        -- Add foreign key if missing
        ALTER TABLE public.memories
        ADD CONSTRAINT fk_memories_user
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

SELECT 'Social Campfire Schema deployed successfully!' AS result;
