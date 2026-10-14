-- ETAPA 4: fechar o acesso público ao banco.
-- NÃO APLICAR antes de: (1) Etapa 1 aplicada; (2) professor criado em Authentication
-- e inserido em public.professores; (3) app novo publicado e login testado.

-- Trava de segurança: impede ficar sem nenhum professor com permissão de escrita.
do $$
begin
  if not exists (select 1 from public.professores) then
    raise exception 'Cadastre ao menos um professor em public.professores antes da Etapa 4';
  end if;
end $$;

-- 1) Remover as políticas públicas totais
do $$
declare t text;
begin
  foreach t in array array['alunos','turmas','historico','metas','hall_aura','backups','acessos','config']
  loop
    execute format('drop policy if exists "public all" on public.%I', t);
  end loop;
end $$;

-- 2) Leitura pública apenas do que o ranking precisa (escrita: somente professor)
do $$
declare t text;
begin
  foreach t in array array['alunos','turmas','hall_aura','metas','config']
  loop
    execute format('drop policy if exists "leitura publica" on public.%I', t);
    execute format('create policy "leitura publica" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;
-- historico, backups e acessos: somente professor (política "professor total" da Etapa 1)

-- 3) Fotos: URL pública continua funcionando (bucket público), sem listagem;
--    escrita somente do professor; limite de tamanho e tipos permitidos.
drop policy if exists "fotos all public" on storage.objects;

drop policy if exists "fotos professor select" on storage.objects;
create policy "fotos professor select" on storage.objects for select to authenticated
  using (bucket_id = 'fotos-alunos' and (select private.is_professor()));

drop policy if exists "fotos professor insert" on storage.objects;
create policy "fotos professor insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos-alunos' and (select private.is_professor()));

drop policy if exists "fotos professor update" on storage.objects;
create policy "fotos professor update" on storage.objects for update to authenticated
  using (bucket_id = 'fotos-alunos' and (select private.is_professor()))
  with check (bucket_id = 'fotos-alunos' and (select private.is_professor()));

drop policy if exists "fotos professor delete" on storage.objects;
create policy "fotos professor delete" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos-alunos' and (select private.is_professor()));

update storage.buckets
   set file_size_limit = 2097152,
       allowed_mime_types = array['image/jpeg','image/png','image/webp']
 where id = 'fotos-alunos';
