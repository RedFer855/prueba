const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'distri');

console.log('Iniciando proceso de preparacion para produccion...');

// 1. Limpiar carpeta distri si existe y crearla de nuevo
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
console.log('Carpeta distri/ creada limpiamente.');

// Funcion auxiliar para copiar carpetas recursivamente
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Copiar archivos HTML principales
const htmlFiles = ['index.html', 'about.html', 'contacto.html', 'precios.html'];
for (const file of htmlFiles) {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`Copiado: ${file} -> distri/${file}`);
  }
}

// 3. Copiar carpeta css
copyDirSync(path.join(rootDir, 'css'), path.join(distDir, 'css'));
console.log('Copiada carpeta css/ -> distri/css/');

// 4. Copiar carpeta imagenes
copyDirSync(path.join(rootDir, 'imagenes'), path.join(distDir, 'imagenes'));
console.log('Copiada carpeta imagenes/ -> distri/imagenes/');

// 5. Copiar dependencias necesarias de node_modules (bootstrap, jquery, popper.js, open-iconic)
const modulesToCopy = [
  'bootstrap/dist',
  'jquery/dist',
  'popper.js/dist',
  'open-iconic/font'
];

for (const mod of modulesToCopy) {
  const src = path.join(rootDir, 'node_modules', mod);
  const dest = path.join(distDir, 'node_modules', mod);
  if (fs.existsSync(src)) {
    copyDirSync(src, dest);
  }
}
console.log('Copiadas librerias esenciales de node_modules/ -> distri/node_modules/');

console.log('Proyecto preparado exitosamente en la carpeta distri/');
