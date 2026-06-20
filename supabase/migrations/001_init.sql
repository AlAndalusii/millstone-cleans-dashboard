-- Paste this into Supabase → SQL Editor → New query → Run

create table if not exists businesses (
  id              uuid        primary key default gen_random_uuid(),
  company_name    text        not null,
  manager_name    text        not null,
  phone           text        not null,
  cleaning_date   date        not null,
  collection_date date        not null,
  contractor      text        not null default '',
  notes           text        not null default '',
  completed       boolean     not null default false,
  created_at      timestamptz not null default now()
);

-- Enable RLS
alter table businesses enable row level security;

-- Allow the anon key (used by the app's server actions) full access.
-- The PIN on the login page is the security gate — only you know it.
create policy "anon_full_access" on businesses
  for all
  to anon
  using (true)
  with check (true);
