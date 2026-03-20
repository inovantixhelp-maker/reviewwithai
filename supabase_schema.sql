
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('ADMIN', 'OWNER', 'CUSTOMER')),
  name text,
  mobile text,
  business_id text, -- Can reference businesses(id) but might be circular if not careful
  created_at bigint default extract(epoch from now()) * 1000
);

-- PLANS
create table public.plans (
  id text primary key, -- 'BASIC', 'GROWTH', etc.
  name text not null,
  price numeric not null,
  features jsonb not null -- Array of features
);

-- BUSINESSES
create table public.businesses (
  id text primary key, -- Using text to match 'biz-123' style or UUID
  name text not null,
  google_place_id text,
  google_maps_url text,
  plan_id text references public.plans(id),
  status text check (status in ('ACTIVE', 'DISABLED', 'INACTIVE')),
  expiry_date bigint,
  total_scans int default 0,
  total_reviews int default 0,
  settings jsonb, -- { enabled, rewardType, customMessage, couponCode }
  full_address text,
  business_image text,
  created_at bigint default extract(epoch from now()) * 1000
);

-- FEEDBACKS
create table public.feedbacks (
  id uuid default uuid_generate_v4() primary key,
  business_id text references public.businesses(id) on delete cascade,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  customer_name text,
  customer_mobile text,
  timestamp bigint,
  resolved boolean default false
);

-- COUPONS
create table public.coupons (
  id text primary key,
  code text unique not null,
  discount_type text check (discount_type in ('PERCENTAGE', 'FIXED')),
  discount_value numeric,
  start_date bigint,
  end_date bigint,
  applicable_plans text[], -- Array of plan IDs
  is_recurring boolean default false,
  status text check (status in ('ACTIVE', 'DISABLED')),
  usage_count int default 0,
  revenue_generated numeric default 0,
  max_usage_per_user int default 1
);

-- TRANSACTIONS
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  business_id text references public.businesses(id),
  business_name text,
  amount numeric,
  date bigint,
  status text check (status in ('SUCCESS', 'PENDING', 'FAILED')),
  coupon_used text,
  plan_id text references public.plans(id),
  utr text,
  screenshot text
);

-- TICKETS
create table public.tickets (
  id uuid default uuid_generate_v4() primary key,
  client_id text references public.businesses(id),
  client_name text,
  subject text,
  description text,
  category text,
  priority text,
  status text check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  created_at bigint,
  last_updated bigint
);

-- TICKET MESSAGES
create table public.ticket_messages (
  id uuid default uuid_generate_v4() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade,
  sender_id text, -- User ID or 'system'
  sender_name text,
  text text,
  timestamp bigint,
  is_read boolean default false,
  role text,
  attachment text
);

-- LIVE MESSAGES (Chat)
create table public.live_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id text,
  receiver_id text,
  sender_name text,
  text text,
  timestamp bigint,
  is_read boolean default false,
  role text,
  attachment text
);

-- GLOBAL SETTINGS
create table public.global_settings (
  id int primary key default 1,
  brand_name text,
  support_email text,
  payment_qr_code text,
  upi_link text,
  google_api_key text,
  whatsapp_api_key text,
  apify_token text,
  constraint single_row check (id = 1)
);

-- RLS POLICIES (Simple for now: Public Read/Write for anon to start, strict later)
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.businesses enable row level security;
alter table public.feedbacks enable row level security;
alter table public.coupons enable row level security;
alter table public.transactions enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.live_messages enable row level security;
alter table public.global_settings enable row level security;

-- Policy: Allow all for anon/authenticated (Modify this for production!)
create policy "Allow all access" on public.profiles for all using (true);
create policy "Allow all access" on public.plans for all using (true);
create policy "Allow all access" on public.businesses for all using (true);
create policy "Allow all access" on public.feedbacks for all using (true);
create policy "Allow all access" on public.coupons for all using (true);
create policy "Allow all access" on public.transactions for all using (true);
create policy "Allow all access" on public.tickets for all using (true);
create policy "Allow all access" on public.ticket_messages for all using (true);
create policy "Allow all access" on public.live_messages for all using (true);
create policy "Allow all access" on public.global_settings for all using (true);

-- SAMPLE DATA
-- Plans
insert into public.plans (id, name, price, features) values
('BASIC', 'Starter', 999, '[{"id": "f1", "name": "QR Codes", "type": "NUMBER", "value": 1}, {"id": "f2", "name": "Monthly Scans", "type": "NUMBER", "value": 500}, {"id": "f3", "name": "Email Alerts", "type": "CHECKBOX", "value": false}]'),
('GROWTH', 'Growth', 2499, '[{"id": "f1", "name": "QR Codes", "type": "NUMBER", "value": 3}, {"id": "f2", "name": "Monthly Scans", "type": "NUMBER", "value": 2000}, {"id": "f3", "name": "Email Alerts", "type": "CHECKBOX", "value": true}, {"id": "f4", "name": "Coupon System", "type": "CHECKBOX", "value": true}]')
on conflict (id) do nothing;

-- Global Settings
insert into public.global_settings (id, brand_name, support_email, upi_link, google_api_key, whatsapp_api_key) values
(1, 'Review With AI', 'inovantix.help@gmail.com', 'upi://pay?pa=rajrishi786@ybl&pn=Rishi%20Raj&am=1000&cu=INR', '', '')
on conflict (id) do nothing;

-- Business Sample
insert into public.businesses (id, name, google_place_id, google_maps_url, plan_id, status, expiry_date, total_scans, total_reviews, settings) values
('biz-123', 'Burger Palace', 'ChIJN1t_tDeuEmsRUsoyG83frY4', 'https://maps.google.com/', 'GROWTH', 'ACTIVE', extract(epoch from now() + interval '30 days') * 1000, 1540, 890, '{"enabled": true, "rewardType": "COUPON", "customMessage": "Thanks for visiting!", "couponCode": "SAVE15"}')
on conflict (id) do nothing;
