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