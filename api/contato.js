export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome_completo, email, telefone, mensagem } = req.body;

  // Envia pro formsubmit usando a variável de ambiente
  await fetch(`https://formsubmit.co/ajax/${process.env.FORM_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ nome_completo, email, telefone, mensagem })
  });

  // Redireciona para a URL privada
  res.redirect(302, process.env.REDIRECT_URL);
}