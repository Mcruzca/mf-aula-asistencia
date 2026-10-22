// Servidor LOCAL de demo. En producción GitHub Pages publica la carpeta public.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const port = Number(process.argv[2]);
const root = path.resolve('public');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8' };
createServer(async (req, res) => {
 res.setHeader('Access-Control-Allow-Origin', '*'); // Desarrollo local.
 res.setHeader('Cache-Control', 'no-store');
 try {
   const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
   const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
   if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
   const content = await readFile(file);
   res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
   res.end(content);
 } catch { res.writeHead(404).end('Archivo no encontrado'); }
}).listen(port, 'localhost', () => console.log('http://localhost:' + port));
