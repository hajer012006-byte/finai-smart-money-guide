-- Add monthly_income column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN monthly_income numeric DEFAULT 0;

-- Update existing profiles to have a default income
UPDATE public.profiles 
SET monthly_income = 5000 
WHERE monthly_income = 0;