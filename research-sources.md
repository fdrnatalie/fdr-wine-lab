# Fontes externas usadas na melhoria

- Open Food Facts — tutorial de API: https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/
  - A consulta pública usa `GET https://world.openfoodfacts.org/api/v2/product/{barcode}`; respostas incluem `status`, `product` e `status_verbose`. Embora a API permita limitar com `fields`, a implementação consulta sem esse filtro para preservar todos os dados disponíveis.
  - A implementação usa essa consulta somente como preenchimento automático, guarda uma cópia expansível da resposta e mantém todos os campos editáveis/manual quando a base não possui o dado.
- MDN — BarcodeDetector: https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector
  - A API detecta códigos lineares/2D em imagens, exige contexto seguro e tem disponibilidade limitada; Safari no iPad pode não oferecer suporte.
  - A implementação tenta a leitura via câmera quando `BarcodeDetector` existe e informa o fallback de digitar o código quando não existe.

- INPI — busca de marcas: https://servicos.busca.inpi.gov.br/marcas
  - Em 02/10/2026, a busca literal por “FDR Wine Lab” retornou zero resultados. A busca é apenas uma triagem inicial e não substitui a análise de colidência por classes, semelhança e situação processual.
- INPI — Guia Básico de Marcas: https://www.gov.br/inpi/pt-br/servicos/marcas/guia-basico
  - O pedido requer cadastro no e-INPI, GRU paga antes do protocolo, envio pelo e-Marcas e acompanhamento da RPI.
- INPI — Classificação de Produtos e Serviços: https://www.gov.br/inpi/pt-br/servicos/marcas/classificacao-marcas
  - Para o produto, as classes avaliadas foram 42 (software/SaaS), 9 (aplicativo baixável) e 41 (educação e eventos).
- INPI — Custos de Marcas: https://www.gov.br/inpi/pt-br/servicos/marcas/custos
  - A tabela consultada indica o código 389 para pedido com especificação pré-aprovada e desconto elegível de 50% para pessoa física, MEI e categorias previstas.
