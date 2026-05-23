export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome_completo, email, telefone, mensagem } = req.body || {};

  if (!nome_completo || !email || !telefone || !mensagem) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  await fetch(`https://formsubmit.co/ajax/${process.env.FORM_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ nome_completo, email, telefone, mensagem }),
  });

  res.redirect('https://picolabz.com/pages/thanks.html');
}
