# Auditoria EduPoints — 14/10/2026

## Falhas encontradas e corrigidas
| # | Falha | Gravidade | Correção |
|---|-------|-----------|----------|
| 1 | Pontos dados sem internet (ou com falha de rede) eram perdidos: o app não reenviava e, ao voltar, o banco sobrescrevia o aparelho | Alta | Fila de envio guardada no aparelho, reenviada sozinha; selo "N PENDENTES" no cabeçalho |
| 2 | Dois aparelhos pontuando ao mesmo tempo sobrescreviam um ao outro (gravava o total, não a soma) | Alta | Soma com checagem do valor anterior e nova tentativa se houver conflito |
| 3 | Sem "desfazer": toque errado em -10 exigia corrigir à mão | Alta | Botão Desfazer por 7 s + botão ↩ em cada item do Histórico |
| 4 | Pontuar vários alunos exigia abrir um por um | Média | "Pontuar vários": seleciona, escolhe o valor, aplica de uma vez (com Desfazer) |
| 5 | Modal de pontuação: tocar numa categoria só preenchia o campo e exigia outro toque | Média | Um toque aplica |
| 6 | Histórico registrava -10 mesmo quando o aluno tinha só 3 pontos (soma do histórico divergia) | Média | Registra o valor realmente aplicado; avisa quando já está em 0 |
| 7 | Falha ao salvar alterações (aluno, turma) era silenciosa | Média | Aviso na tela |
| 8 | Aviso "+N pts" cobria o aluno pontuado | Baixa | Aviso no topo |
| 9 | Cabeçalho cortado e rolagem lateral em celular de 360 px | Média | Selo de status compacto |
| 10 | Botão + cobria o último aluno da lista | Média | Espaço no fim da lista |
| 11 | Botões pequenos (26–38 px) | Média | Mínimo de 44 px |
| 12 | 10+ campos sem nome para leitor de tela; botões da lista sem descrição | Média | Nomes (aria-label) em todos |
| 13 | alert() travando a tela | Baixa | Aviso não bloqueante |

## Ainda recomendado (depende de decisão)
- Etapa 4 (fechar escrita pública no banco): hoje qualquer pessoa com a chave pública ainda consegue alterar dados.
- Plano Supabase Pro ou keep-alive (pausa por inatividade).
- Repositório público com senhas antigas e nomes de alunos no histórico do Git.
- Telas Alunos/Config/Hall ainda usam parte do visual antigo (cards Aura/EX no Hall).
