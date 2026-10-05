# FDR Wine Lab — Degustação às Cegas

Aplicativo web para conduzir rodadas de degustação de vinho às cegas. A experiência registra palpites sensoriais e de rótulo, compara respostas ao gabarito, calcula pontuação e mantém um histórico local no navegador.

## Principais recursos

- Cadastro de participantes, dono da garrafa e rodadas
- Etapas às cegas, visual e ficha do rótulo
- Aplicação rápida da mesma resposta para todos os participantes
- Catálogos de uvas, regiões, sub-regiões e aromas com opções personalizadas
- Consulta opcional de ficha técnica por código de barras
- Pontuação exata, aproximada ou incorreta com explicações didáticas
- Estado salvo localmente no dispositivo, sem conta nem banco de dados

## Executar localmente

```bash
python3 server.py
```

Depois, abra `http://localhost:3000`.

## Publicação estática

A versão de produção é gerada em `dist/` com:

```bash
rm -rf dist && mkdir -p dist
cp index.html styles.css app.js dist/
cp -R public/. dist/
```

O branch `gh-pages` contém exclusivamente essa saída estática para uso no GitHub Pages.

## Dados e privacidade

As rodadas ficam no `localStorage` do navegador. A busca opcional por código de barras consulta a API pública Open Food Facts; o preenchimento manual permanece disponível para todos os campos.
