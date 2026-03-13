
CREATE TABLE public.saved_traders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trader_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, trader_id)
);

ALTER TABLE public.saved_traders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved traders"
  ON public.saved_traders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save traders"
  ON public.saved_traders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave traders"
  ON public.saved_traders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
