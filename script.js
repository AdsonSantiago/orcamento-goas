// Função para calcular o preço total
function calculateTotal() {
  var checkboxes = document.querySelectorAll('input[name="products"]:checked');
  var totalPrice = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.value.includes("-")) {
      var pricePart = checkbox.value.split(" - ")[1]; // Obtém a parte do preço

      if (/^R\$\d+\.\d{2}$/.test(pricePart)) {
        // Remove "R$ " e converte para um número
        var price = parseFloat(pricePart.replace("R$", ""));
        totalPrice += price;
      } else {
        console.error("Formato de valor inválido:", pricePart);
      }
    }
  });

  return totalPrice.toFixed(2);
}

// Função para gerar a página de orçamento
function generateBudget() {
  const selectedProducts = document.querySelectorAll('input[name="products"]');
  const result = document.getElementById("result");
  const produtosSelecionados = document.getElementById("selectedProducts");
  const totalPriceElement = document.getElementById("totalPrice");

  // Limpa a lista de produtos selecionados
  produtosSelecionados.innerHTML = "";

  var totalPrice = 0; // Inicializa o preço total

  const produtosSelecionadosArray = []; // Para armazenar os produtos selecionados

  selectedProducts.forEach((input) => {
    var productName =
      input.parentElement.querySelector(".produto-text").textContent;
    var quantity = parseInt(input.value);
    var pricePart = input.parentElement
      .querySelector(".produto-text")
      .textContent.split(" - ")[1];

    if (/^R\$\d+\.\d{2}$/.test(pricePart)) {
      var price = parseFloat(pricePart.replace("R$", ""));
      var subtotal = price * quantity;

      if (quantity > 0) {
        // Cria um elemento de lista para o produto selecionado com a quantidade
        var listItem = document.createElement("li");
        listItem.textContent = productName + " - Quantidade: " + quantity;
        produtosSelecionados.appendChild(listItem);

        totalPrice += subtotal; // Adiciona o subtotal ao preço total

        // Adicione o produto ao array de produtos selecionados
        produtosSelecionadosArray.push({
          name: productName,
          quantity: quantity,
        });
      }
    } else {
      console.error("Formato de valor inválido:", pricePart);
    }
  });

  // Exibe o preço total
  totalPriceElement.textContent = totalPrice.toFixed(2);

  // Mostra a página de resultados
  result.style.display = "block";

  return {
    produtosSelecionados: produtosSelecionadosArray,
    totalPrice: totalPrice.toFixed(2),
  };
}

// Associa a função de geração de orçamento ao botão
const generateButton = document.getElementById("generateButton");
generateButton.addEventListener("click", generateBudget);

////////////////////////////////////////////////////////////////////////////////////////////////
// pdf.js
function gerarPDF(produtosSelecionados, totalPrice) {
  var doc = new jsPDF();
  var logo = new Image();
  logo.src =
    "https://cdn.glitch.global/6734fcaa-1157-4b47-9cdf-898c918a353e/vivo-120.png?v=1692977465269";
  var titulo = new Image();
  titulo.src =
    "https://cdn.glitch.global/6734fcaa-1157-4b47-9cdf-898c918a353e/logo-titulo.png?v=1693333031528";

  // https://cdn.glitch.global/6734fcaa-1157-4b47-9cdf-898c918a353e/vivo-120.png?v=1692977465269

  logo.onload = function () {
    doc.addImage(logo, "PNG", 170, 270, 30, 20);

    doc.text("ORÇAMENTO CASA INTELIGENTE", 105, 15, null, null, "center");

    doc.setFont("helvetica"); // Nome da fonte, você pode substituir por outras fontes suportadas
    doc.text("Produtos - Preços:", 10, 35);

    // Inicialize uma string para a lista de produtos
    var produtosText = "";

    produtosSelecionados.forEach((produto, index) => {
      // Adicione cada produto ao PDF
      produtosText += `${index + 1}. ${produto.name}\n`;
    });

    // Defina a coordenada vertical (y) para a lista de produtos
    var yPos = 50;
    doc.setFont("helvetica"); // Nome da fonte, você pode substituir por outras fontes suportadas
    doc.setFontType("normal"); // Estilo da fonte (normal, bold, italic, bolditalic)

    // Definir o tamanho da fonte
    doc.setFontSize(12); // Tamanho da fonte em pontos
    // Adicione a lista de produtos ao PDF
    doc.text(produtosText, 10, yPos, { fontSize: 8 }); // Aqui, o tamanho da fonte
    yPos += 10; // Ajuste a coordenada vertical conforme necessário

    doc.setFontStyle("bold"); // Defina o estilo para negrito
    doc.setFontSize(14);
    // Adicione o texto do preço total como resumo no final do PDF
    doc.text(`Preço Total: R$ ${totalPrice}`, 10, yPos + 195);
    doc.setFontStyle("normal");

    // Crie uma linha horizontal
    doc.setLineWidth(0.5); // Defina a largura da linha como 2 (aumente ou diminua conforme desejado)
    doc.setDrawColor(128, 0, 128); // Defina a cor da linha como roxa (128, 0, 128 é a representação de roxo no formato RGB)
    doc.line(10, 265, 200, 265); // Desenhe a linha com as configurações definidas

    var base64String = doc.output("datauristring");
    window.open(base64String, "_blank");
  };
}

// Adicione um ouvinte de eventos ao botão "otherButton"
const otherButton = document.getElementById("otherButton");
otherButton.addEventListener("click", function () {
  const { produtosSelecionados, totalPrice } = generateBudget();

  // Chame a função gerarPDF com os produtosSelecionados e o totalPrice
  gerarPDF(produtosSelecionados, totalPrice);
});
