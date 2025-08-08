const fs = require('fs');
const path = require('path');

// Read the HTML template
const htmlTemplate = fs.readFileSync(path.join(__dirname, '../src/index.html'), 'utf8');

// Read all the JavaScript files
const fireflyJs = fs.readFileSync(path.join(__dirname, '../src/components/Firefly.js'), 'utf8');
const rendererJs = fs.readFileSync(path.join(__dirname, '../src/systems/Renderer.js'), 'utf8');
const inputJs = fs.readFileSync(path.join(__dirname, '../src/systems/InputSystem.js'), 'utf8');
const gameJs = fs.readFileSync(path.join(__dirname, '../src/Game.js'), 'utf8');

// Combine all JavaScript
const allJs = `
${fireflyJs}

${rendererJs}

${inputJs}

${gameJs}

// Start the game
const game = new Game();
game.start();
`;

// Replace the script tags with inline JavaScript
const finalHtml = htmlTemplate
  .replace(/<!-- Component Scripts -->[\s\S]*?<!-- Game Initialization -->[\s\S]*?<\/script>/g, 
    `<script>${allJs}</script>`);

// Write the final HTML
fs.writeFileSync(path.join(__dirname, '../dist/index.html'), finalHtml);

console.log('✅ Build complete! Final game created at dist/index.html');

// Calculate size
const size = Buffer.byteLength(finalHtml, 'utf8');
console.log(`📊 Size: ${size} bytes (${(size/1024).toFixed(2)} KB)`);
console.log(`🎯 Remaining: ${13312 - size} bytes until 13KB limit`);
