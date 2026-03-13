
-- Add trader_type enum
CREATE TYPE public.trader_type AS ENUM ('individual', 'agency');

-- Add trader_type column to profiles (nullable, only relevant for traders)
ALTER TABLE public.profiles ADD COLUMN trader_type public.trader_type DEFAULT NULL;
