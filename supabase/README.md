# Banco de dados do EduPoints (Supabase)

Ordem para ativar o acesso seguro. **Não pule etapas** e **não publique o app novo
antes das etapas 1 e 2**, senão o login do professor não funciona.

1. **Etapa 1** — aplicar `migrations/20261004_etapa1_base_segura_professor.sql`
   (SQL Editor do Supabase). É aditiva: não remove nada, o app atual continua igual.
2. **Criar o professor** — Supabase → Authentication → Users → *Add user*
   (e-mail e senha escolhidos por você; marque *Auto Confirm User*).
   Depois, no SQL Editor:
   ```sql
   insert into public.professores (id, nome)
   select id, 'Marcos' from auth.users where email = 'SEU_EMAIL_AQUI';
   ```
3. **Desligar cadastro aberto** — Authentication → Providers/Sign In → desmarque
   *Allow new users to sign up* (contas de professor e de alunos serão criadas só por você).
4. **Publicar o app novo** e testar: entrar com o cadeado, pontuar um aluno, enviar uma foto.
5. **Etapa 4** — aplicar `migrations/20261004_etapa4_fechar_acesso_publico.sql`.
   Só depois disso o banco deixa de aceitar escrita pública.

Cópia de segurança feita antes de qualquer mudança: schema `snapshot_20261004`
(fora da API). Pode ser removido quando você não precisar mais dela.
