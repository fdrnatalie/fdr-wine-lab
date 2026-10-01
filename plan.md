# Plano — Vinho às Cegas

## Resultado
Um SPA estático, em português do Brasil, para conduzir rodadas de degustação às cegas no celular. Todo o estado é salvo no `localStorage`; não há login, servidor, banco ou dependência de internet para a lógica do jogo.

## Arquitetura de entrega
- **Serviço:** frontend estático, servido pelo processo de desenvolvimento na porta 3000 e publicado a partir de `dist/`; a busca opcional consulta diretamente a API pública do Open Food Facts no navegador e mantém preenchimento manual como fallback.
- **Rotas:** apenas `/`, com fallback de SPA para a publicação; `GET /manus-routes.json` é o manifesto exigido.
- **Cache:** HTML e estado da aplicação permanecem mutáveis; assets locais podem ser servidos como arquivos normais.
- **Persistência:** `localStorage` com versão (`vinhocego-state-v1`), com migração defensiva para estado inicial.

## Estrutura
- `index.html`: shell acessível, marca, containers de telas e carregamento dos estilos/scripts.
- `styles.css`: sistema visual mobile-first, tokens de cor, cartões, chips, ranking e feedback responsivo.
- `app.js`: modelo de estado, renderização, eventos, controles de aplicação em lote, catálogos curados/customizáveis, consulta da ficha técnica completa por código de barras, gabarito opcional por critério, pontuação graduada, explicações didáticas e histórico local.
- `public/manus-routes.json`: manifesto da rota raiz.
- `public/vinhocego-icon.png` e `public/favicon.svg`: identidade/favicons.
- `app.config.ts`: metadado de logo do projeto.

## Fluxo do produto
1. Configuração: cadastrar participantes e iniciar a primeira rodada.
2. Gabarito: escolher dono da garrafa e preencher as respostas oficiais disponíveis; campos vazios não são exibidos aos participantes nem pontuados.
3. Etapa às cegas: cada participante elegível responde nariz, boca e tipo sem ver o rótulo.
4. Revelação: liberar a etapa visual e registrar cor, limpidez e intensidade visual; aromas podem ter várias escolhas.
5. Ficha do rótulo: o dono registra produtor, vinho, país, região, sub-região/denominação, safra, teor alcoólico, uvas e classificação no gabarito; a busca por código carrega os campos pontuáveis e uma ficha técnica completa expansível; cada participante palpita somente os critérios que o dono informou.
6. Resultado: comparar respostas sensoriais e os sete palpites pontuáveis do rótulo com o gabarito, mostrar verde para 1 ponto, amarelo para 0,5 ponto e vermelho para 0, e explicar confusões comuns e o perfil da garrafa.
7. Histórico: revisar rodadas, consultar a ficha da garrafa, excluir uma rodada ou reiniciar todo o jogo com confirmação.

## Critérios de aceite
- Inputs são predominantemente seletores/chips, sem digitação repetitiva.
- Cada linha de resposta oferece um controle “igual para todos” para aplicar rapidamente a mesma escolha aos participantes.
- O gabarito é a última coluna e o dono não pontua na própria rodada.
- A pontuação acumulada aparece por participante e por rodada.
- Rodadas salvas sobrevivem a refresh e podem ser excluídas.
- A ficha do rótulo fica salva junto da rodada e aparece na revisão do histórico; produtor e nome são referência, enquanto país, região, sub-região, safra, álcool, uvas e classificação somam pontos.
- O catálogo inicial inclui um conjunto amplo de regiões, sub-regiões, castas e aromas, mas cada catálogo permite inserir manualmente uma opção ausente.
- O dono pode consultar uma ficha por código EAN/UPC; a leitura por câmera é tentada quando o navegador oferece BarcodeDetector e a entrada manual sempre permanece disponível.
- A pontuação aproximada vale 0,5 ponto para escalas adjacentes, mesma família visual, mesma origem ampla, safra vizinha, faixa de álcool vizinha ou sobreposição de aromas/castas.
- Cada resultado mostra uma explicação curta sobre a diferença e um painel de aprendizado baseado no gabarito da garrafa.
- O dono pode avançar e salvar o gabarito com informações faltantes; cada rodada pontua somente os critérios ativos.
- O layout é usável em telas estreitas, com contraste e alvos de toque grandes.
- O manifesto de rotas responde 200 com JSON válido.

## Verificação
Inspecionar fonte, executar `node --check app.js`, iniciar o servidor e validar `/` e `/manus-routes.json` com `curl`. Se o Web Dev fornecer diagnóstico, corrigir erros acionáveis antes do checkpoint.
