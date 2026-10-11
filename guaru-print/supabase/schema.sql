-- ═══════════════════════════════════════════════════════════════════
-- Guaru Print — esquema do Supabase
-- Rode no SQL Editor do projeto (uma vez). Idempotente.
--
-- Segurança:
-- • RLS ativo em todas as tabelas, SEM políticas para anon/authenticated:
--   apenas o servidor do site (chave service_role) lê e escreve.
-- • Artes dos clientes ficam no bucket PRIVADO "quote-files"; o acesso é
--   somente por links assinados e temporários.
-- • Imagens do site (painel) ficam no bucket público "site-media".
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- Conteúdo administrável (serviços, projetos, FAQ, informações comerciais)
create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  entity text not null check (entity in ('service', 'project', 'faq', 'settings')),
  key text not null,
  data jsonb not null,
  published boolean not null default true,
  sort integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (entity, key)
);
create index if not exists content_entries_entity_idx on public.content_entries (entity, published, sort);
alter table public.content_entries enable row level security;

-- Solicitações de orçamento
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  items jsonb not null,
  customer jsonb not null,
  files text[] not null default '{}',
  file_names text[] not null default '{}',
  source text not null default 'site',
  status text not null default 'novo'
    check (status in ('novo', 'em-analise', 'respondido', 'aprovado', 'concluido', 'arquivado')),
  created_at timestamptz not null default now()
);
create index if not exists quote_requests_created_idx on public.quote_requests (created_at desc);
alter table public.quote_requests enable row level security;

-- Tabela de preços (preparada, ainda NÃO usada pelo site — ver src/lib/quote/pricing.ts)
create table if not exists public.price_rules (
  id uuid primary key default gen_random_uuid(),
  product text not null,
  basis text not null check (basis in ('m2', 'unit', 'thousand')),
  amount_cents integer not null check (amount_cents >= 0),
  match jsonb,
  min_quantity integer,
  active boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.price_rules enable row level security;

-- Buckets de armazenamento
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quote-files', 'quote-files', false, 26214400, array['application/pdf', 'image/png', 'image/jpeg', 'image/svg+xml'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 8388608, array['image/png', 'image/jpeg', 'image/webp', 'image/avif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Nenhuma política em storage.objects para anon: uploads de clientes só
-- acontecem via URLs assinadas emitidas pelo servidor (createSignedUploadUrl).
