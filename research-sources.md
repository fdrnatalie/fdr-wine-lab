# Fontes externas usadas na melhoria

- Open Food Facts — tutorial de API: https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/
  - A consulta pública usa `GET https://world.openfoodfacts.org/api/v2/product/{barcode}`; respostas incluem `status`, `product` e `status_verbose`. Embora a API permita limitar com `fields`, a implementação consulta sem esse filtro para preservar todos os dados disponíveis.
  - A implementação usa essa consulta somente como preenchimento automático, guarda uma cópia expansível da resposta e mantém todos os campos editáveis/manual quando a base não possui o dado.
- MDN — BarcodeDetector: https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector
  - A API detecta códigos lineares/2D em imagens, exige contexto seguro e tem disponibilidade limitada; Safari no iPad pode não oferecer suporte.
  - A implementação tenta a leitura via câmera quando `BarcodeDetector` existe e informa o fallback de digitar o código quando não existe.
