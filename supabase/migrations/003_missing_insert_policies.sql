-- Missing INSERT policies discovered during signup/billing wiring:
-- profiles and subscriptions only had SELECT/UPDATE policies, which
-- silently blocked the session-authenticated inserts made during signup
-- and the mock billing upgrade flow.

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
