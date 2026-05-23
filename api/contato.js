import { parse } from 'querystring';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const raw = await getRawBody(req);
  const body = parse(raw);
  const { nome_completo, email, telefone, mensagem } = body;

  console.log('Dados recebidos:', { nome_completo, email, telefone });

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Picolabz Site <onboarding@resend.dev>',
      to: ['contato@picolabz.com'],
      subject: `Novo contato de ${nome_completo}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${nome_completo}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `,
    }),
  });

  res.redirect('https://www.picolabz.com/pages/thanks.html');

}