-- ETAPA 1 (aditiva): identidade do professor + políticas para usuário autenticado.
-- Não remove nem altera nenhuma política existente; o app atual segue funcionando.

-- 1) Schema privado (não exposto pela API) para funções de segurança
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- 2) Quem é professor: tabela controlada apenas pelo dono do projeto (sem escrita via API)
create table if not exists public.professores (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null default '',
  criado_em  timestamptz not null default now()
);
alter table public.professores enable row level security;

drop policy if exists "professor le o proprio registro" on public.professores;
create policy "professor le o proprio registro"
  on public.professores for select to authenticated
  using (id = (select auth.uid()));

-- 3) Função de checagem (security definer, search_path vazio, fora da API pública)
create or replace function private.is_professor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.professores p where p.id = (select auth.uid())
  );
$$;
revoke all on function private.is_professor() from public, anon;
grant execute on function private.is_professor() to authenticated;

-- 4) Políticas do professor autenticado (convivem com as públicas até a Etapa 4)
do $$
declare t text;
begin
  foreach t in array array['alunos','turmas','historico','metas','hall_aura','backups','acessos','config']
  loop
    execute format('drop policy if exists "professor total" on public.%I', t);
    execute format(
      'create policy "professor total" on public.%I for all to authenticated
         using ((select private.is_professor()))
         with check ((select private.is_professor()))', t);
  end loop;
end $$;

comment on table public.professores is 'Usuários com permissão de professor. Inserir somente via SQL pelo dono do projeto.';
