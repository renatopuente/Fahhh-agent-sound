#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindows = process.platform === 'win32';

if (!isWindows) {
  console.error('❌ Este hook solo funciona en Windows (usa PowerShell MediaPlayer).');
  console.error('   Para macOS/Linux, adapta el comando a `afplay` o `mpg123`.');
  process.exit(1);
}

// 1. Copiar el MP3 a ~/sounds/
const soundsDir = path.join(os.homedir(), 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

const mp3Src = path.join(__dirname, '..', 'Fahhh.mp3');
const mp3Dest = path.join(soundsDir, 'Fahhh.mp3');

if (!fs.existsSync(mp3Src)) {
  console.error('❌ No se encontró Fahhh.mp3 en el paquete.');
  process.exit(1);
}

fs.copyFileSync(mp3Src, mp3Dest);

// 2. Construir URI del archivo (barras forward para PowerShell)
const mp3Uri = 'file:///' + mp3Dest.replace(/\\/g, '/');

// 3. Leer settings.json existente
const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');
let settings = {};

if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    console.error('⚠️  settings.json existente tiene JSON inválido. Creando backup...');
    fs.copyFileSync(settingsPath, settingsPath + '.bak');
  }
}

// 4. Construir entrada del hook
const hookCommand =
  `Add-Type -AssemblyName presentationCore; ` +
  `$mp = New-Object system.windows.media.mediaplayer; ` +
  `$mp.open([uri]'${mp3Uri}'); ` +
  `$mp.Volume = 1.0; ` +
  `$mp.Play(); ` +
  `Start-Sleep 4`;

const hookEntry = {
  matcher: '',
  hooks: [
    {
      type: 'command',
      command: hookCommand,
      shell: 'powershell',
      async: true,
    },
  ],
};

// 5. Inyectar hooks (sin pisar los existentes de otros eventos)
if (!settings.hooks) settings.hooks = {};
settings.hooks.PermissionRequest = [hookEntry];
settings.hooks.Stop = [hookEntry];

// 6. Guardar settings.json
const claudeDir = path.join(os.homedir(), '.claude');
if (!fs.existsSync(claudeDir)) {
  fs.mkdirSync(claudeDir, { recursive: true });
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');

console.log('');
console.log('✅ Fahhh sound hook instalado correctamente!');
console.log('');
console.log('   🔊 MP3 guardado en :  ' + mp3Dest);
console.log('   ⚙️  Settings en     :  ' + settingsPath);
console.log('');
console.log('   El sonido se reproducirá cuando Claude:');
console.log('   • Solicite permiso para ejecutar una herramienta (PermissionRequest)');
console.log('   • Termine de responder y espere tu input (Stop)');
console.log('');
console.log('   Reinicia Claude Code para aplicar los cambios.');
console.log('');
