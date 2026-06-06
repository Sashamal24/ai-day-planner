-- Запусти це в Supabase Dashboard → SQL Editor

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  status text not null default 'inbox' check (status in ('inbox', 'today', 'done')),
  created_at timestamptz default now()
);

-- Row Level Security: кожен бачить тільки свої задачі
alter table tasks enable row level security;

create policy "Users manage own tasks"
  on tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
