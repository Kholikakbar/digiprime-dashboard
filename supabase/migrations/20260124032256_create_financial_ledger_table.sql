-- Create the financial_ledger table
CREATE TABLE IF NOT EXISTS public.financial_ledger (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('INCOME', 'EXPENSE')),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    reference_id TEXT, -- Can be Order ID or Stock Purchase ID
    category TEXT NOT NULL, -- e.g., 'SALES', 'STOCK_PURCHASE', 'REFUND'
    balance_after DECIMAL(12, 2) DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view ledger
CREATE POLICY "Allow authenticated users to select from financial_ledger"
ON public.financial_ledger FOR SELECT TO authenticated USING (true);

-- Create policy to allow authenticated users to insert into ledger
CREATE POLICY "Allow authenticated users to insert into financial_ledger"
ON public.financial_ledger FOR INSERT TO authenticated WITH CHECK (true);
