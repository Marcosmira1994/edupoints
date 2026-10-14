---
name: EduPoints
description: Painéis escolares escuros com a linguagem visual Gameplex.
colors:
  primary: "#ff7a45"
  primary-hover-fill: "#ffac87"
  danger-hover-fill: "#4a272d"
  on-primary: "#211007"
  sage: "#99bb98"
  success: "#9bd3aa"
  gold: "#e3b86b"
  danger: "#ff9292"
  coal: "#0c0d0f"
  panel: "#151619"
  raised-panel: "#1e2024"
  divider: "#303238"
  input-stroke: "#696d77"
  text: "#f4f4f5"
  muted: "#a9adb7"
typography:
  display:
    fontFamily: "Oxanium, system-ui, sans-serif"
    fontSize: "clamp(28px, 3vw, 38px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "Oxanium, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
rounded:
  chip: "7px"
  control: "8px"
  item: "10px"
  table: "12px"
  card: "14px"
  modal: "16px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "16px"
  card: "20px"
  large: "24px"
  shell: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  input:
    backgroundColor: "#101114"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.chip}"
    padding: "10px 16px"
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.chip}"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "20px"
---

# Design System: EduPoints

## Overview

**Creative North Star: "O placar escolar Gameplex"**

Painéis sóbrios de competição organizam a participação escolar. A referência Gameplex escolhida pelo usuário aparece no carvão, no laranja quente, nos títulos geométricos e nos contornos finos; o conteúdo e a identidade continuam EduPoints.

A implementação é feita em código, com SVGs de traço simples e fontes locais. Não há raster gerado para a interface de produção. `logo.png` e os arquivos de fontes são ativos preexistentes. Esta documentação registra `index.html` com a camada final `design/ui.css`; `design/ranking.html` e `design/design.html` são estudos históricos, sem autoridade sobre a interface de produção.

**Key Characteristics:**

- Hierarquia densa e legível.
- Superfícies sólidas, divisórias discretas e acento laranja.
- Oxanium para títulos e números; Inter para leitura e controles.
- Movimento curto e funcional.

## Colors

A paleta combina carvão e laranja quente com cores auxiliares contidas. Os valores normativos estão no frontmatter.

### Primary

- **Laranja de ação:** botões principais, filtros selecionados, foco e posição de liderança.
- **Tinta sobre laranja:** texto escuro nos controles preenchidos.

### Secondary

- **Sálvia:** monogramas e avatares secundários.
- **Verde de confirmação:** pontuação positiva e conexão saudável.
- **Ouro de reconhecimento:** pontos do Hall e conexão pendente.
- **Rosa de alerta:** erros, estado offline e deduções.

### Neutral

- **Carvão:** plano de fundo da aplicação.
- **Painel:** navegação, cartões e listas.
- **Painel elevado:** menus e superfícies de interação.
- **Divisória:** limites estruturais discretos.
- **Contorno de campo:** limites mais visíveis de entradas.
- **Branco de leitura / cinza de apoio:** informação principal e metadados.

**The Solid Surface Rule.** Use fundos sólidos e limites finos; não recupere névoa neon, grades decorativas ou partículas da versão anterior.

## Typography

**Display Font:** Oxanium, system-ui, sans-serif. Arquivos locais nos pesos 600, 700 e 800.

**Body Font:** Inter, system-ui, sans-serif. Arquivos locais nos pesos 400, 500, 600 e 700. Ambas usam `font-display: swap`.

Os títulos geométricos dão caráter esportivo; Inter mantém formulários e dados confortáveis. A hierarquia normativa acima representa os papéis recorrentes. Pontos de liderança usam Oxanium 700 (32px); pontos na classificação usam peso 600 (19px). Números de posição e pontos usam algarismos tabulares. Campos usam Inter 400 (16px). Títulos de página tornam-se 32px até 900px e 28px até 600px.

## Layout

A aplicação ocupa `100dvh`, com rolagem interna do conteúdo e cabeçalho de 88px. A navegação lateral tem 224px; o conteúdo recebe 32px de margem interna e largura máxima de 1180px. Configurações limita-se a 860px. O ranking usa três cartões em colunas iguais, intervalo de 16px e lista compacta abaixo.

Até 1199px, a lateral tem 190px, o conteúdo recebe 24px e cartões recebem 16px. O menu de cabeçalho fica oculto a partir de 1200px. Até 900px, a lateral desaparece, o conteúdo ocupa a largura disponível e o cabeçalho tem 76px. A navegação usa o menu do cabeçalho; a antiga barra inferior fica oculta.

Até 600px, margens laterais são 16px. O líder ocupa a largura inteira e os dois seguintes compartilham a linha inferior, com intervalo de 10px. A classificação passa de colunas `70px minmax(0,1fr) 100px 20px` para `38px minmax(0,1fr) 56px 14px`, com nomes quebráveis e pontos alinhados à direita. Avatares de lista passam de 36px para 32px. Modais alinham-se à base, limitados a `88dvh`. Controles de menu e bloqueio têm 40px no celular; ações comuns têm altura mínima de 44px e filtros, 40px. Campos mantêm 16px para evitar zoom de entrada.

A seleção em lote tem barra fixa que acompanha o deslocamento da lateral e reserva espaço na lista. As ações administrativas ficam no fluxo: Adicionar aluno e Scanner na barra do ranking; Adicionar aluno na barra da lista de alunos. Os controles `.fab` legados permanecem ocultos. Os avisos de pontuação ficam centralizados no topo, 14px abaixo do cabeçalho. Impressão remove cabeçalho, navegação e ações fixas, libera a rolagem e usa fundo branco.

## Elevation & Depth

Cartões são planos; a separação vem de tonalidade e borda. Sombras estruturais ficam em elementos flutuantes: menu (`0 14px 32px #0005`), painel de conexão (`0 16px 30px #0006`). A sobreposição modal usa fundo preto translúcido (`#000b`), sem desfoque. O painel do perfil é sólido, sem sombra ou desfoque, com uma regra explícita que prevalece sobre o estilo legado.

## Shapes

Controles são retângulos suavemente arredondados; os raios normativos distinguem filtros, campos, itens, tabelas, cartões e modais. Avatares da classificação e botões do cabeçalho são circulares. Contornos têm 1px; o foco visível tem 2px. Os cartões de liderança têm silhueta regular, sem pódios ornamentais.

## Components

### Buttons

Botões principais têm preenchimento laranja, texto escuro, peso 600 e altura mínima de 44px. Secundários usam fundo transparente e contorno de campo. Ações destrutivas têm fundo vinho e texto rosa; pontos positivos têm fundo verde escuro. O hover principal clareia para `#ff956b`. Hover é restrito a dispositivos com ponteiro fino e suporte a hover. Desabilitados usam opacidade `.5` e cursor de indisponibilidade.

### Chips

Filtros têm contorno discreto, texto de apoio, peso 500 e altura mínima de 40px. Seleção usa laranja e peso 600; preserve o estado funcional do filtro.

### Cards / Containers

Cartões comuns têm preenchimento de painel, contorno fino e 20px internos. O primeiro colocado usa fundo marrom profundo (`#221914`) e borda cobre (`#79432b`). O Hall da Aura compartilha essa linguagem sólida. Estados vazios usam o mesmo contêiner, com ícone, título e instrução reais.

### Inputs / Fields

Campos têm fundo escuro próprio, contorno de campo, altura mínima de 46px e texto de 16px. Foco troca a borda para laranja e aplica contorno externo de 2px com afastamento de 2px. Preserve rótulos e validações existentes.

### Navigation

Itens laterais têm ícone de 20px, texto Inter 500 (13px), altura mínima de 48px e alinhamento à esquerda. Ativo usa fundo marrom (`#302019`) e texto laranja. O menu compacto preserva as mesmas seções e expõe o estado expandido.

### Ranking and profile

Cartões de líderes e linhas de classificação são botões nativos que abrem o perfil, com nome acessível incluindo aluno, posição e pontos. Linhas têm altura mínima de 78px no desktop e 76px no celular. O foco da linha fica dentro do contêiner, com afastamento negativo de 4px. O diálogo do perfil recebe seu nome semântico de `#profile-name`, mantém Tab e Shift+Tab dentro do modal e fecha com Escape, devolvendo o foco ao controle de origem. Avatares aceitam foto existente ou iniciais; não invente dados de alunos.

Movimento de produção: `design/motion.css` e `design/motion.js`, carregados depois do sistema visual. Botões recebem preenchimento circular a partir da posição do ponteiro (500ms, inspirado no `.box-style` observado no Gameplex), com feedback de pressão de 120ms. Cartões de líderes inclinam no máximo 2° por eixo e sobem 3px, somente com mouse e ponteiro fino; saídas, rolagem e perda de foco limpam o efeito. O avatar e as setas têm deslocamentos pequenos.

Entradas de navegação usam WAAPI: 280ms, deslocamento de 14px, escalonamento de 35ms limitado a 175ms e curva `cubic-bezier(.23,1,.32,1)`. Nova navegação cancela entradas anteriores. Menus revertem transições de 160–180ms com origem no acionador; modais usam 220ms e curva `cubic-bezier(.32,.72,0,1)`. O movimento é decorativo e localizado, sem reprodução automática dos dados do ranking. Teclado torna mudanças de painel imediatas. Movimento reduzido remove deslocamento, tilt, preenchimento animado e entradas, preservando estado e foco visível. Foco geral usa laranja com afastamento de 4px.

### Hall da Aura

Arquivo histórico em `design/hall.js` e `design/hall.css`. Um seletor nativo de bimestre mantém a escolha durante atualizações e ordena períodos pela data de encerramento. Mostrar nome/data do período, destaques e classificação completa. Preservar nomes/pontos do snapshot; empates usam classificação de competição e os destaques mantêm os três primeiros valores distintos de pontuação.

Fotos: retratos 88px no desktop e 72px no celular, opacidade total e sem filtros; inicial é fallback para ausência/falha. Nomes longos quebram linha. No celular, destaques usam linhas de uma coluna com foto à esquerda. Alunos ainda cadastrados têm botão de perfil atual; registros sem cadastro atual permanecem texto histórico, sem ação falsa. Diferenciar vazio, carregando, offline e erro; falha de atualização preserva dados já carregados. Estados de erro oferecem nova tentativa.

Extensões de escala: corpo 14px, cabeçalho de período 26px/22px, nome de destaque 18px/17px, pontuação 30px/26px. Superfície de campeão reutiliza #221914 com borda #79432b e metadados quentes #c7b4a9. Movimento herda as entradas existentes; hover eleva apenas cartões clicáveis e é desativado com movimento reduzido.

## Do's and Don'ts

### Do:

- **Do** use dados reais, nomes legíveis e números tabulares no ranking.
- **Do** preserve a navegação por teclado, os rótulos e o foco visível.
- **Do** use `design/ui.css` como autoridade visual de produção.

### Don't:

- **Don't** recupere ciano e magenta neon, brilhos, partículas ou fundos holográficos.
- **Don't** use os estudos históricos como especificação da interface publicada.
- **Don't** adicione alunos, fotos ou pontuações fictícios ao estado da aplicação.

