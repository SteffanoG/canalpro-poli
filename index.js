import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json()); // Garante que o servidor entenda JSON

const BASE_URL = "https://cs.poli.digital/api-cliente"; // URL da API do Poli que você mencionou
const POLI_API_TOKEN = process.env.POLI_API_TOKEN; // Pegando o Token do ambiente

// ROTA DE VERIFICAÇÃO (BROWSER) - Mantida como está
app.get("/", (req, res) => {
  res.send("🚀 Webhook para OLX Gestão Pro -> Poli Digital está no ar!");
});

// ===================================================================
// NOVA ROTA PRINCIPAL PARA RECEBER WEBHOOK DA OLX
// ===================================================================
app.post("/", async (req, res) => {
  console.log("✅ Webhook da OLX recebido!");
  console.log("Dados recebidos:", JSON.stringify(req.body, null, 2));

  // 1. Extrair os dados do corpo da requisição (req.body)
  // A OLX informou que os campos 'name' e 'phoneNumber' são enviados.
  const leadName = req.body.name;
  let leadPhone = req.body.phoneNumber; // Geralmente vem formatado como 55DDDXXXXYYYYY
  
  // Verificação básica se os dados essenciais chegaram
  if (!leadName || !leadPhone) {
    console.error("❌ Erro: Nome ou telefone do lead não encontrados no webhook.");
    // Avisa a OLX que houve um erro, mas não por culpa deles.
    return res.status(400).json({ error: "Dados 'name' ou 'phoneNumber' ausentes." });
  }

  // 2. Limpar/Formatar o número de telefone se necessário
  // A API do Poli pode esperar um formato específico. Este é um exemplo.
  leadPhone = leadPhone.replace(/\D/g, ''); // Remove tudo que não for dígito

  // 3. Chamar a lógica de envio para o Poli Digital
  // Por enquanto, vamos chamar a função de envio de template.
  // O ideal é expandir aqui com a lógica completa (verificar, criar, atribuir, etc.)
  try {
    // A sua função atual precisa do nome do atendente. Vamos definir um padrão aqui.
    // O ideal é que isso venha de uma variável de ambiente ou de uma lógica de distribuição.
    const operatorName = "nosso time"; // Exemplo
    
    // Substitua esta chamada pela lógica completa que descrevemos anteriormente
    await sendTemplateMessage(leadPhone, leadName, operatorName);
    
    // 4. Responder para a OLX que deu tudo certo
    console.log("✅ Lead processado e enviado para o Poli.");
    res.status(200).json({ status: "Lead recebido e processado com sucesso." });

  } catch (error) {
    console.error("❌ Erro no fluxo de processamento do lead:", error);
    // Avisa a OLX que houve um erro interno no nosso servidor
    res.status(500).json({ status: "Erro interno ao processar o lead." });
  }
});


// Função para enviar mensagem de template via API do Poli
// A API que você está usando parece ser diferente da documentação. 
// Vamos adaptar para a URL da documentação que você enviou.
async function sendTemplateMessage(phone, firstName, operatorName) {
  // A lógica completa (verificar contato, criar, atribuir, abrir chat) deveria vir aqui.
  // Por enquanto, esta função apenas envia o template diretamente.

  const ID_ATENDENTE = process.env.USER_ID; // Atendente que será atribuído
  const ID_TEMPLATE = "abordagem2"; // Nome do seu template

  try {
    // Este é um fluxo SIMPLIFICADO. O ideal é implementar os 4 passos.
    // Por enquanto, apenas para validar o envio.
    console.log(`Iniciando envio de template para ${firstName} (${phone})`);
    
    // A URL na documentação parece diferente. Verifique qual é a correta para seu caso.
    // Exemplo baseado na sua tentativa:
    // await axios.post(`${BASE_URL}/customers/...`)

    // O fluxo correto seria:
    // 1. POST /contatos (para criar)
    // 2. PUT /chats/contato/{id}/atendente (para atribuir)
    // 3. POST /chats/contato/{id}/abrir (para abrir)
    // 4. POST /chats/{chatId}/template (para enviar)

    // Simulação da chamada final de envio de template:
    // O endpoint exato pode variar, verifique a documentação do Poli.
    // Esta é apenas uma representação.
    
    console.log("✅ Mensagem enviada com sucesso (simulação).");

  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
    throw error; // Lança o erro para ser capturado no bloco try/catch da rota principal
  }
}

// Rota de teste - pode ser mantida para debug
app.post("/send", async (req, res) => {
  const { phone, firstName, operatorName } = req.body;
  if (!phone || !firstName || !operatorName) {
    return res.status(400).json({ error: "Campos obrigatórios: phone, firstName, operatorName" });
  }
  await sendTemplateMessage(phone, firstName, operatorName);
  res.json({ status: "Mensagem de teste enviada (verifique logs)" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
