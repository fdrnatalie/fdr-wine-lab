# Plano — Vinho às Cegas

## Resultado
Um SPA estático, em português do Brasil, para conduzir rodadas de degustação às cegas no celular. Todo o estado é salvo no `localStorage`; não há login, servidor, banco ou dependência de internet para a lógica do jogo.

## Arquitetura de entrega
- **Serviço:** frontend estático, servido pelo processo de desenvolvimento na porta 3000.
- **Rotas:** apenas `/`, com fallback de SPA para a publicação; `GET /manus-routes.json` é o manifesto exigido.
- **Cache:** HTML e estado da aplicação permanecem mutáveis; assets locais podem ser servidos como arquivos normais.
- **Persistência:** `localStorage` com versão (`vinhocego-state-v1`), com migração defensiva para estado inicial.

## Estrutura
- `index.html`: shell acessível, marca, containers de telas e carregamento dos estilos/scripts.
- `styles.css`: sistema visual mobile-first, tokens de cor, cartões, chips, ranking e feedback responsivo.
- `app.js`: modelo de estado, renderização, eventos, pontuação, histórico e exportação/importação simples.
- `public/manus-routes.json`: manifesto da rota raiz.
- `public/vinhocego-icon.png` e `public/favicon.svg`: identidade/favicons.
- `app.config.ts`: metadado de logo do projeto.

## Fluxo do produto
1. Configuração: cadastrar participantes e iniciar a primeira rodada.
2. Gabarito: escolher dono da garrafa e preencher respostas oficiais.
3. Etapa às cegas: cada participante elegível responde nariz, boca e tipo sem ver o rótulo.
4. Revelação: liberar a etapa visual e registrar cor, limpidez e intensidade visual.
5. Resultado: comparar respostas com o gabarito, mostrar acertos/erros, salvar a rodada e atualizar o ranking.
6. Histórico: revisar rodadas, excluir uma rodada ou reiniciar todo o jogo com confirmação.

## Critérios de aceite
- Inputs são predominantemente seletores/chips, sem digitação repetitiva.
- O gabarito é a última coluna e o dono não pontua na própria rodada.
- A pontuação acumulada aparece por participante e por rodada.
- Rodadas salvas sobrevivem a refresh e podem ser excluídas.
- O layout é usável em telas estreitas, com contraste e alvos de toque grandes.
- O manifesto de rotas responde 200 com JSON válido.

## Verificação
Inspecionar fonte, executar `node --check app.js`, iniciar o servidor e validar `/` e `/manus-routes.json` com `curl`. Se o Web Dev fornecer diagnóstico, corrigir erros acionáveis antes do checkpoint.
