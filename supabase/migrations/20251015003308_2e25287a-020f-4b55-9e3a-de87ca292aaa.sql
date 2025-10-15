-- Fix user_roles RLS policies to allow teacher login

-- Drop existing SELECT policy that's too restrictive
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;

-- Create new policies that allow proper access
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Add policy to allow checking roles during login/signup
-- This is needed so users can verify their role after authentication
CREATE POLICY "Allow authenticated users to check their roles during login"
ON user_roles FOR SELECT
USING (auth.uid() IS NOT NULL);
