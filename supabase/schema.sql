-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (public profile linked to auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null check (role in ('SUPER_ADMIN', 'ADMIN')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
-- Policy to allow users to read their own data
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);

-- PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  type text not null check (type in ('ACCOUNT', 'CREDIT')),
  price numeric not null default 0,
  stock_count integer default 0, -- Denormalized count helpful for display
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STOCK ACCOUNTS
create table public.stock_accounts (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  email text not null,
  password text not null,
  additional_info text, -- e.g. recovery email
  status text not null check (status in ('AVAILABLE', 'SOLD', 'RESERVED')) default 'AVAILABLE',
  order_id uuid, -- reference to orders(id) later
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STOCK CREDITS
create table public.stock_credits (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  amount numeric not null, -- Nominal value
  code text, 
  status text not null check (status in ('AVAILABLE', 'SOLD')) default 'AVAILABLE',
  order_id uuid, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  shopee_order_no text not null unique,
  buyer_username text not null,
  product_id uuid references public.products(id), 
  quantity integer not null default 1,
  total_price numeric,
  status text not null check (status in ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED')) default 'PENDING',
  order_date timestamp with time zone default timezone('utc'::text, now()) not null,
  processed_at timestamp with time zone,
  notes text
);

-- Add foreign key back to orders in stock tables
alter table public.stock_accounts add constraint fk_stock_accounts_order foreign key (order_id) references public.orders(id);
alter table public.stock_credits add constraint fk_stock_credits_order foreign key (order_id) references public.orders(id);

-- TRANSACTIONS (Financial log)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id),
  type text not null check (type in ('INCOME', 'REFUND')),
  amount numeric not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ADMIN LOGS
create table public.admin_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.users(id),
  action text not null,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- RLS Setup (Basic)
alter table public.products enable row level security;
alter table public.stock_accounts enable row level security;
alter table public.stock_credits enable row level security;
alter table public.orders enable row level security;
alter table public.transactions enable row level security;
alter table public.admin_logs enable row level security;

-- Allow authenticated users (Admins) to do everything for now
create policy "Enable all for authenticated" on public.products for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated" on public.stock_accounts for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated" on public.stock_credits for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated" on public.orders for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated" on public.transactions for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated" on public.admin_logs for all using (auth.role() = 'authenticated');

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role, full_name)
  values (new.id, new.email, 'ADMIN', new.raw_user_meta_data->>'full_name'); -- Default to ADMIN
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
