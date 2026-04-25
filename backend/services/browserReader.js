const https   = require('https');
const http    = require('http');
const { URL } = require('url');

const MAX_EXCERPT_LENGTH = 800;
// Maximum number of HTTP redirects to follow for a single request
const MAX_REDIRECTS = 5;
// Per-request timeout in milliseconds (covers connection + read time)
const REQUEST_TIMEOUT_MS = 10000;

// Private/internal IPv4 ranges that must not be fetched (SSRF prevention)
const BLOCKED_HOSTNAME_RE = /^(localhost|.*\.local)$/i;
const PRIVATE_IPV4_RE = /^(127\.|10\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/;
// IPv6: loopback [::1], link-local [fe80::], unique-local [fc/fd],
// and all IPv4-mapped [::ffff:*] addresses (which may map to private IPv4).
const PRIVATE_IPV6_RE = /^\[(?:::1|::ffff:|fe[89ab][0-9a-f]:|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

/**
 * Returns true when the given hostname resolves to a private/internal address.
 * Blocks well-known private hostnames and numeric private-range IPs (v4 + v6)
 * without performing an async DNS lookup.  This covers the most common SSRF
 * vectors; a production system should additionally validate post-DNS IPs.
 */
function isBlockedHostname(hostname) {
  if (BLOCKED_HOSTNAME_RE.test(hostname)) return true;
  if (PRIVATE_IPV4_RE.test(hostname)) return true;
  if (PRIVATE_IPV6_RE.test(hostname)) return true;
  return false;
}

/**
 * Validates that a URL is safe to fetch (http/https, no private IPs).
 * Throws an Error with a descriptive message if the URL is unsafe.
 */
function validateUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('URL inválida.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Solo se permiten URLs con protocolo http o https.');
  }

  if (isBlockedHostname(parsed.hostname)) {
    throw new Error('No se puede acceder a esa dirección.');
  }

  return parsed;
}

/**
 * Fetches a URL and returns a plain-text excerpt of the page content.
 * Uses only Node built-in modules — no extra dependencies needed.
 *
 * @param {string} rawUrl       The URL to fetch.
 * @param {number} redirectsLeft Remaining redirect hops (internal use).
 * @returns {Promise<{ title: string, excerpt: string, url: string }>}
 */
function fetchPage(rawUrl, redirectsLeft = MAX_REDIRECTS) {
  let parsed;
  try {
    parsed = validateUrl(rawUrl);
  } catch (err) {
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    const protocol = parsed.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method:   'GET',
      headers:  {
        'User-Agent': 'Mozilla/5.0 (compatible; TorreDeControl/1.0)',
        'Accept':     'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      },
      timeout: REQUEST_TIMEOUT_MS,
    };

    const req = protocol.request(options, (res) => {
      // Follow redirects — validate the new URL and respect the depth limit
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        if (redirectsLeft <= 0) {
          return reject(new Error('Se superó el límite de redirecciones.'));
        }
        try {
          const redirectUrl = new URL(res.headers.location, rawUrl).toString();
          validateUrl(redirectUrl); // throws if unsafe
          return fetchPage(redirectUrl, redirectsLeft - 1).then(resolve).catch(reject);
        } catch (err) {
          return reject(err);
        }
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`La página respondió con estado ${res.statusCode}.`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const html = Buffer.concat(chunks).toString('utf8');
        resolve(extractContent(html, rawUrl));
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Tiempo de espera agotado al intentar leer la página.'));
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

/**
 * Strips HTML and extracts a title + short excerpt from raw HTML.
 */
function extractContent(html, url) {
  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch
    ? decodeEntities(titleMatch[1].trim())
    : new URL(url).hostname;

  // Remove script / style / head blocks.
  // Use [^>]* for the closing tag to handle malformed tags like </script bar>.
  let text = html
    .replace(/<script[\s\S]*?<\/script[^>]*>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style[^>]*>/gi, ' ')
    .replace(/<head[\s\S]*?<\/head[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')         // strip remaining tags
    .replace(/\s{2,}/g, ' ')
    .trim();

  text = decodeEntities(text);

  // Return first MAX_EXCERPT_LENGTH chars as excerpt
  const excerpt = text.length > MAX_EXCERPT_LENGTH
    ? text.slice(0, MAX_EXCERPT_LENGTH) + '…'
    : text;

  return { title, excerpt, url };
}

/**
 * Decodes common HTML entities in a single pass to avoid double-decoding.
 */
function decodeEntities(str) {
  return str.replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp);/g, (entity) => {
    switch (entity) {
      case '&amp;':   return '&';
      case '&lt;':    return '<';
      case '&gt;':    return '>';
      case '&quot;':  return '"';
      case '&#39;':
      case '&apos;':  return "'";
      case '&nbsp;':  return ' ';
      default:        return entity;
    }
  });
}

module.exports = { fetchPage };
