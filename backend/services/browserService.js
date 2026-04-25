const https = require('https');
const http  = require('http');
const { URL } = require('url');

const MAX_CHARS     = 3000;
const MAX_REDIRECTS = 5;

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/\s*script[^>]*>/gi, ' ')
    .replace(/<style[\s\S]*?<\/\s*style[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function fetchPage(rawUrl, redirectsLeft = MAX_REDIRECTS) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return reject(new Error('URL inválida.'));
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return reject(new Error('Solo se aceptan URLs http o https.'));
    }

    const lib = parsed.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      method: 'GET',
      headers: {
        'User-Agent': 'Torre-de-Control-Browser/1.0',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es,en;q=0.9',
      },
      timeout: 8000,
    };

    const req = lib.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (redirectsLeft <= 0) {
          return reject(new Error('Se superó el límite de redirecciones.'));
        }
        return fetchPage(res.headers.location, redirectsLeft - 1).then(resolve).catch(reject);
      }

      if (res.statusCode < 200 || res.statusCode >= 400) {
        return reject(new Error(`El servidor respondió con estado ${res.statusCode}.`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const html = Buffer.concat(chunks).toString('utf8');
        const text = stripHtml(html).slice(0, MAX_CHARS);
        resolve({ url: rawUrl, text, length: text.length });
      });
      res.on('error', reject);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Tiempo de espera agotado al acceder a la URL.'));
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = { fetchPage };
