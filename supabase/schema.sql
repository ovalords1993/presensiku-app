-- Presensiku database schema
-- Apply this in Supabase SQL editor after creating a new project.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  role text not null default 'murid',
  tenant_id uuid not null default '00000000-0000-0000-0000-000000000000'
);

create table if not exists public.classes (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name text not null,
  tenant_id uuid not null default '00000000-0000-0000-0000-000000000000'
);

create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name text not null,
  nisn text,
  class_id uuid references public.classes(id) on delete set null,
  class_name text,
  wali text,
  status_today text not null default 'Hadir',
  tenant_id uuid not null default '00000000-0000-0000-0000-000000000000'
);

create table if not exists public.attendance_logs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  student_id uuid references public.students(id) on delete set null,
  name text not null,
  class_name text,
  check_in text,
  status text not null default 'Hadir',
  color text not null default 'emerald',
  notes text,
  tenant_id uuid not null default '00000000-0000-0000-0000-000000000000'
);

create index if not exists idx_profiles_role
  on public.profiles (role, tenant_id);

create index if not exists idx_classes_tenant_id
  on public.classes (tenant_id, created_at desc);

create index if not exists idx_students_tenant_id
  on public.students (tenant_id, created_at desc);

create index if not exists idx_attendance_logs_tenant_id
  on public.attendance_logs (tenant_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.attendance_logs enable row level security;

-- Note:
-- This project uses server-side Supabase service role for data writes and reads in API routes.
-- Anonymous/public access is intentionally restricted by default.
-- If you need authenticated user access in the future, add explicit policies for each table.
