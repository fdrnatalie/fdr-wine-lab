# Direção de design — Vinho às Cegas

## Exploração inicial

### Tema: Mesa de bar noturna
Interface escura e acolhedora, com contraste de papel e vinho, pensada para uso à meia-luz durante a degustação. Probabilidade: 0,06.

### Tema: Cartão de pontuação de adega
Visual editorial inspirado em fichas de degustação, com serifas clássicas, linhas finas e aparência de caderno. Probabilidade: 0,04.

### Tema: Painel de serviço rápido
Interface utilitária e calorosa, com blocos grandes, controles quase táteis e feedback imediato para não interromper a conversa. Probabilidade: 0,08.

## Direção escolhida: Painel de serviço rápido

### Movimento de design
Mobile-first funcional com influência de dashboards de campo: hierarquia forte, superfícies empilhadas e controles grandes para toque sem perder o ritual do vinho.

### Princípios centrais
1. **Uma decisão por vez:** a pessoa sempre entende qual é o próximo passo.
2. **Pontuar sem planilha:** seletores e chips substituem digitação.
3. **Verde/vermelho sem ansiedade:** feedback é claro, mas discreto e celebratório.
4. **Dados locais:** o histórico fica no navegador, sem login ou setup técnico.

### Filosofia de cor
Base ameixa quase preta para ambiente de degustação, marfim quente para leitura e coral/uva para ação. Verde musgo e terracota sinalizam acerto e erro sem usar cores neon.

### Paradigma de layout
Cabeçalho compacto com marca e status; conteúdo em uma coluna no celular e duas colunas no desktop: ação principal à esquerda e placar/contexto à direita. Cartões com bordas suaves, sem excesso de sombra.

### Elementos assinatura
- Marca com um olho minimalista envolvendo uma taça, representando descobrir o vinho sem ver o rótulo.
- Selo de etapa “às cegas”/“visual” no topo da rodada.
- Barra de progresso da rodada.
- Chips de resposta com estados selected, correct e wrong.
- Placar persistente em formato de ranking curto.

### Filosofia de interação
Ações primárias sempre visíveis e nomeadas com verbo. Seletores usam botões de toque mínimo de 44px. A etapa às cegas bloqueia a análise visual até o momento da revelação. O dono da garrafa aparece separado como “gabarito” e não entra na pontuação.

### Animação
Transições curtas de 160–220ms para troca de etapa, atualização do placar e expansão de rodadas. Nada depende de animação para comunicar estado.

### Sistema tipográfico
Títulos em **DM Serif Display** para a sensação de ritual; corpo e controles em **DM Sans** para leitura rápida. Fallbacks serif/sans-serif mantêm a identidade sem depender da rede.

### Essência de marca
Uma mesa entre amigos, um pouco de teatro e uma forma leve de aprender vinho.

### Voz da marca
Direta, cúmplice e encorajadora: “vamos descobrir”, “sem olhar”, “agora revela”. Evita jargão desnecessário.

### Wordmark/logo
Ícone quadrado de fundo ameixa cheio, com uma forma de olho em coral e uma taça marfim no espaço negativo. A mesma marca aparece no cabeçalho e no favicon.

### Cor de assinatura
**Ameixa de adega `#2A1724`**, usada como base e identificação principal do produto.
