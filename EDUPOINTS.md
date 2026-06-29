# EduPoints — Documentação Completa

## Visão Geral

O **EduPoints** é um aplicativo web de gamificação escolar que permite ao professor
registrar e acompanhar a pontuação dos alunos em tempo real, transformando o
desempenho e o comportamento da turma em um ranking competitivo e divertido,
inspirado em cartas colecionáveis (estilo Pokémon EX).

**Objetivo:** incentivar a participação, o bom comportamento e a entrega de
tarefas, premiando os alunos com pontos e reconhecendo os campeões de cada
bimestre no "Hall da Aura".

**Tecnologias usadas:**
- **HTML/CSS/JavaScript puro** (single-page app em um único `index.html`, sem build).
- **Supabase** (PostgreSQL + Realtime + Storage) como backend e fonte de verdade.
- **localStorage** como cache/fallback offline.
- **Chart.js** — gráficos.
- **Animate.css** — animações de entrada.
- **DaisyUI / Tailwind** — componentes de UI.
- **html5-qrcode** — leitura de QR Code pela câmera.
- **Playwright** (`shot.js`) — captura de screenshots de desenvolvimento.

O app é hospedado de forma estática (ex.: GitHub Pages) e funciona em desktop,
tablet e celular.

---

## Acesso e Segurança

### Senha de acesso geral
Ao abrir o app, é exibida uma tela de bloqueio ("access gate"). É necessário
digitar a **senha de acesso geral** para entrar:

- **Senha de acesso:** `gaia6ano`

Sem essa senha ninguém visualiza o conteúdo. Após digitá-la corretamente, o
acesso fica registrado na sessão (`sessionStorage`) e o app é liberado.

### Modo admin vs visitante
Existem dois perfis:

| Perfil | Como entra | O que pode fazer |
|--------|-----------|------------------|
| **Visitante** (padrão) | Apenas a senha de acesso geral | Visualizar Ranking, Histórico e Hall da Aura |
| **Admin** (professor) | Senha de acesso geral **+** senha de admin | Tudo: pontuar, gerenciar alunos/turmas, scanner, metas, config, backups |

- **Senha de admin:** `admin4585`

O estado de admin fica guardado em `sessionStorage` (`ep_admin`). Ao ativar o
modo admin, a interface revela os menus e botões restritos (FAB de pontuar,
abas Alunos, Scanner e Config).

### O que cada perfil pode ver/fazer
- **Visitante:** menu reduzido — somente **Ranking**, **Histórico** e **Hall da Aura**.
  As fotos de perfil dos alunos ficam visíveis após a senha de acesso.
- **Admin:** acesso completo a todas as abas e ações de escrita.

---

## Funcionalidades

### Ranking
- **Pódio top 3** com cartas douradas estilo **EX** (efeito holográfico e glow
  pulsante arredondado).
- **Lista** dos demais alunos com skin de campeão e avatares.
- **Empate**: quando há empate na liderança, todos os empatados recebem fundo
  dourado / carta dourada.
- **Badges permanentes** de campeões de bimestres anteriores exibidos junto ao
  nome no ranking.
- Estrela destacando os primeiros colocados e fundo animado com partículas
  douradas.
- Filtro por turma e animações de entrada (somente na primeira carga).
- Modal de **perfil do aluno** ao clicar no card.

### Alunos (admin)
- Lista de alunos com **busca por nome** e **filtro por turma**.
- Adicionar / editar / excluir aluno.
- **Categorias de pontuação predefinidas** (botões rápidos):
  - 📚 Tarefa de casa entregue **+3**
  - 🙋 Participação em aula **+2**
  - ✅ Atividade em sala completa **+5**
  - 🏆 Prova/trabalho importante **+10**
  - ⭐ Comportamento exemplar **+5**
  - 🤝 Ajudou um colega **+2**
  - Valor **personalizado** (positivo ou negativo, ex.: `+3` ou `-3`).
- **Campo de observação** ao pontuar (texto livre registrado no histórico).
- **Upload de foto de perfil** do aluno (armazenada no Supabase Storage).

### Scanner (admin)
- **Leitura de QR Code** pela câmera do dispositivo (html5-qrcode).
- **Adicionar pontos via câmera**: ao escanear o QR do aluno, abre o modal de
  pontuação. As movimentações feitas por QR ficam marcadas como `📷 QR Code` no
  histórico (manuais aparecem como `👆 Manual`).

### Histórico
- Lista das **últimas movimentações** de pontos (mais recentes primeiro).
- Exibe pontos ganhos/perdidos, aluno, data e a **observação registrada**.
- Ícones ✅ (ganho) / ❌ (perda) e origem (Manual ou QR Code).
- **Visível para visitantes**.
- Admin pode limpar o histórico.

### Hall da Aura
- Galeria das **cartas EX douradas dos campeões por bimestre**, no estilo
  Pokémon EX (holográfico, bordas arredondadas).
- **Como encerrar um bimestre:** na aba Config, ao salvar o Hall da Aura, o(s)
  campeão(ões) do bimestre é(são) eternizado(s) com nome do bimestre (ex.:
  "2º Bimestre 2025").
- Em caso de empate geral, todos os líderes recebem carta dourada.
- Gera **badges permanentes** que passam a aparecer no ranking e na lista de alunos.

### Meta Semanal
- **Configurar meta** coletiva do período (pontuação alvo da turma).
- **Barra de progresso** mostrando o quanto a turma já alcançou.
- **Período personalizado** com data de início e fim.
- **Excluir meta** quando desejado.
- A meta **não reseta os pontos** dos alunos.

### Config (admin)
- **Gerenciar turmas** (criar / excluir).
- **Exportar CSV** dos dados e **backup em JSON**.
- **Backup automático no Supabase** (tabela `backups`).
- **Restaurar backup** a partir de um JSON salvo (com relatório de alunos atualizados).
- **Log de acessos ao site**: total de acessos e os últimos registros (dispositivo,
  navegador, resolução, IP e data). Mantém os **30 acessos mais recentes** e
  permite limpar o histórico de acessos.
- **Encerrar bimestre e salvar Hall da Aura** (eterniza os campeões).
- **Zerar pontos para novo bimestre** (dupla confirmação; limpa pontos e
  histórico, mas **preserva o Hall da Aura**).
- **Banner de aviso de reset** compartilhado entre dispositivos (tabela `config`).

### Sincronização
- **Supabase como fonte de verdade**; `localStorage` serve de cache e fallback offline.
- **Realtime sync** entre dispositivos: alterações em alunos, histórico e turmas
  são propagadas em tempo real via canal `postgres_changes`.
- **Indicador ONLINE / OFFLINE** (e "SINCRONIZANDO") no header.
- **Backup automático a cada 24h** na nuvem.

---

## Banco de Dados (Supabase)

Projeto Supabase: `https://bzjwfwonelhxfphwrnyn.supabase.co` (acesso via chave
publishable no front-end).

**Tabelas:**
- `alunos` — alunos, pontos, turma, foto, observações.
- `turmas` — turmas/classes.
- `historico` — movimentações de pontos (valor, origem, observação, data).
- `metas` — metas do período (alvo, datas).
- `backups` — snapshots automáticos/manuais em JSON.
- `hall_aura` — campeões eternizados por bimestre.
- `acessos` — log de acessos ao site (dispositivo, navegador, resolução, IP).
- `config` — estado compartilhado (ex.: banner de aviso de reset).

**Outros recursos:**
- **RLS** (Row Level Security) configurado nas tabelas.
- **Storage** do Supabase para as **fotos de perfil** dos alunos.
- **Realtime** habilitado para `alunos`, `historico` e `turmas`.

---

## Como Usar

### Passo a passo para o professor (admin)
1. Abra o app e digite a **senha de acesso geral** (`gaia6ano`).
2. Toque no botão/menu de **admin** e digite a **senha de admin** (`admin4585`).
3. Na aba **Config**, crie as **turmas** e, na aba **Alunos**, cadastre os alunos
   (e opcionalmente envie a foto de cada um).
4. Para pontuar: abra um aluno e escolha uma **categoria** rápida ou um valor
   personalizado; adicione uma **observação** se quiser.
5. Use o **Scanner** para pontuar rapidamente lendo o QR Code do aluno.
6. Configure a **Meta Semanal** para engajar a turma.
7. Ao final do período, em **Config**: **encerre o bimestre / salve o Hall da
   Aura** e, se quiser recomeçar, **zere os pontos** (o Hall é preservado).
8. Faça/baixe **backups** periodicamente (CSV ou JSON).

### Passo a passo para os alunos (visitantes)
1. Abra o app e digite a **senha de acesso geral** (`gaia6ano`).
2. Veja o **Ranking** e descubra quem está liderando (pódio com cartas douradas).
3. Confira o **Histórico** das pontuações recentes.
4. Visite o **Hall da Aura** para ver os campeões dos bimestres anteriores.

---

## Histórico de Versões

Principais funcionalidades adicionadas, em ordem cronológica:

1. Armazenamento migrado para **Supabase** com fallback offline em localStorage.
2. **Supabase Realtime** — atualização em tempo real entre dispositivos.
3. Indicador **online** e sync limpo com Supabase.
4. **Campo de observação** no histórico e no modal de pontuar.
5. **Categorias predefinidas** de pontuação.
6. **Meta semanal** coletiva com barra de progresso, período personalizado e
   opção de excluir meta.
7. **Modo admin** com senha fixa.
8. **Histórico visível para visitantes**.
9. **Backup automático na nuvem** e correções na restauração via histórico.
10. **Foto de perfil** dos alunos com upload.
11. Redesign completo do **ranking** com perfil do aluno, cards modernos,
    avatares no pódio, hover flutuante e botão tela cheia.
12. Integração de **Animate.css, Chart.js e DaisyUI**.
13. **Senha de acesso geral** + fotos restritas a admin (depois liberadas após senha).
14. **Log de acessos ao site** (limite de 30 registros + limpar histórico).
15. **Hall da Aura** — infraestrutura, salvar bimestre e cartas estilo Pokémon EX.
16. **Empate geral**: todos os líderes recebem carta dourada.
17. **Badges permanentes** de campeão no ranking e na lista de alunos.
18. **Banner de aviso de reset** compartilhado (tabela config).
19. **Zerar pontos** para novo bimestre (dupla confirmação, mantém o Hall).
20. **Carta dourada** estilo Mew EX com efeito holográfico e glow pulsante arredondado.
21. **Menu hambúrguer** no header (mobile e desktop).
22. **Background animado** com partículas douradas em todas as telas.
