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

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Picolabz Site <noreply@picolabz.com>',
      to: ['contato@picolabz.com'],
      subject: `Novo contato de ${nome_completo}`,
      reply_to: email,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0A0F;color:#EEF0F8;border-radius:12px">
          <h2 style="color:#9D6FF0;margin-bottom:24px">📬 Novo contato pelo site</h2>
          <p><strong style="color:#9D6FF0">Nome:</strong> ${nome_completo}</p>
          <p><strong style="color:#9D6FF0">E-mail:</strong> ${email}</p>
          <p><strong style="color:#9D6FF0">Telefone:</strong> ${telefone}</p>
          <p><strong style="color:#9D6FF0">Mensagem:</strong></p>
          <p style="background:#16162A;padding:16px;border-radius:8px;border-left:3px solid #7B3FE4">${mensagem}</p>
          <hr style="border-color:#16162A;margin:24px 0"/>
          <p style="color:#7A7E9A;font-size:12px">Enviado via picolabz.com</p>
        </div>
      `,
    }),
  });

  const resendData = await resendRes.json();
  console.log('Resend status:', resendRes.status);
  console.log('Resend body:', JSON.stringify(resendData));

  res.setHeader('Content-Type', 'text/html');
  res.status(200).end(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=https://www.picolabz.com/pages/thanks.html" />
      </head>
      <body>Redirecionando...</body>
    </html>
  `);
}