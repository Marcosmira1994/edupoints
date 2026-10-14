# EduPoints — componentes de produção

Autoridade: `index.html` + `design/ui.css`. Valores normativos em `../DESIGN.md`; espelho de implementação em `tokens.json`. `ranking.html` e `design.html` são estudos históricos.

- **Ação principal** (`.btn-p`, `.btn-g`): Inter 600/12px, laranja, texto escuro, raio 8px, padding 11px 18px, mínimo 44px. Hover #ff956b apenas com ponteiro fino. Secundária (`.btn-gh`, `.btn-b`) transparente com borda #696d77. Destrutiva (`.btn-r`) vinho/rosa.
- **Campo** (`.inp`, `.sel`): fundo #101114, borda #696d77, raio 8px, mínimo 46px, Inter 400/16px. Foco laranja 2px, afastamento 2px. Preservar label e validação.
- **Filtro** (`.chip`): raio 7px, mínimo 40px, padding 10px 16px, Inter 500/12px. Selecionado laranja com texto #211007 e peso 600.
- **Cartão** (`.ui-card`, `.ep-card`, `.leader-card`): #151619, borda #303238, raio 14px, padding 20px (líderes: 16px até 1199px), sem sombra. Líder: #221914 / #79432b; hover troca a borda para laranja.
- **Classificação** (`.ranking-row`): botão nativo que abre perfil, contorno de foco interno, linhas de mínimo 78px/76px. Nome quebra; pontos à direita; números tabulares. Avatar circular 36px/32px. Fundo de hover #1e2024.
- **Navegação** (`.side-link`, `.menu-item`): Inter 500/13px, ícone 20px, mínimo 48px, ativo #302019/laranja. Lateral 224px; 190px até 1199px; oculta até 900px, usando menu do cabeçalho. Barra inferior antiga oculta.
- **Barras de ação** (`.ranking-actions`, `.st-tools`): ações no fluxo e com quebra de linha. Administrador encontra Adicionar aluno e Scanner no ranking, e Adicionar aluno na lista. Os `.fab` legados ficam ocultos em `go` e `updateAdminUI`.
- **Modal** (`.ep-modal`): painel sólido, raio 16px, padding 28px; sobreposição #000b sem blur. Até 600px, base da tela, padding 22px 18px, máximo 88dvh. Perfil tem painel explicitamente sólido, nome semântico de `#profile-name`, foco contido e Escape com retorno ao controle de origem.
- **Pontuação rápida** (`.qpa`, `.qp1`, `.qpr`): confirmação #1c3025/#9bd3aa ou dedução #351d21/#ff9292, bordas visíveis; grade com quatro colunas.
- **Progresso** (`.ui-bar`): trilha #1e2024 de 5px, preenchimento laranja sólido; não usar gradiente neon.
- **Conexão** (`#sb-badge`): ponto e texto de estado, sem pulso; no celular os rótulos de conectado/offline sem pendências podem ficar ocultos.

Foco geral laranja 2px com afastamento 4px. Botões desabilitados têm opacidade .5. Movimento em `motion.css`/`motion.js`: preenchimento circular de 500ms a partir do ponteiro; pressão 120ms; tilt de até 2° com mouse; entradas WAAPI de 280ms escalonadas; menus 160–180ms e modais 220ms. Navegação interrompe entradas anteriores; teclado e movimento reduzido não recebem deslocamentos de painel. Ícones SVG de traço simples. Fontes Oxanium e Inter são locais e preexistentes; nenhum raster de produção foi gerado nesta adaptação.

Avisos de pontuação: #dui-toast-container centralizado horizontalmente, no topo a 14px abaixo do cabeçalho; não sobrepor o centro do conteúdo.

- **Hall da Aura** (`.hall-toolbar`, `.hall-honor`, `.hall-results`): seletor nativo de período; destaques dos três valores distintos de pontos, preservando empates; classificação histórica completa. Retratos de 88px/72px, inicial em falhas. Botões somente para perfis atuais disponíveis. Estados de carregamento, vazio e erro com nova tentativa e foco preservado. Implementação em `hall.js`/`hall.css`.
