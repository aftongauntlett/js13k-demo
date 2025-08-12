const fs = require("fs");
const path = require("path");

// Read the HTML template
const htmlTemplate = fs.readFileSync(
  path.join(__dirname, "../src/index.html"),
  "utf8"
);

// Read all the GOLFED JavaScript files
const electronJs = fs.readFileSync(
  path.join(__dirname, "../src/components/ElectronGolfed.js"),
  "utf8"
);
const tutorialJs = fs.readFileSync(
  path.join(__dirname, "../src/components/TutorialGolfed.js"),
  "utf8"
);
const glossaryJs = fs.readFileSync(
  path.join(__dirname, "../src/components/GlossaryGolfed.js"),
  "utf8"
);
const orbitalSystemJs = fs.readFileSync(
  path.join(__dirname, "../src/systems/OrbitalSystemGolfed.js"),
  "utf8"
);
const audioSystemJs = fs.readFileSync(
  path.join(__dirname, "../src/systems/AudioSystemGolfed.js"),
  "utf8"
);
const gameJs = fs.readFileSync(
  path.join(__dirname, "../src/GameGolfed.js"),
  "utf8"
);

// Combine all JavaScript
const allJs = `
${electronJs}

${tutorialJs}

${glossaryJs}

${orbitalSystemJs}

${audioSystemJs}

${gameJs}
`;

// Replace the script tags in HTML with the combined JavaScript
const builtHtml = htmlTemplate.replace(
  /<!-- Component Scripts -->[\s\S]*?<!-- Game Initialization -->/,
  `<!-- All Combined & Golfed JavaScript -->
  <script>
${allJs}

// Initialize the golfed game
window.game = new G();
window.tutorial = window.game.tutorial; // Make tutorial globally accessible
  </script>`
);

// Write the built file
fs.writeFileSync(path.join(__dirname, "../dist/index.html"), builtHtml);

// Calculate sizes
const originalSize = htmlTemplate.length + allJs.length;
const builtSize = builtHtml.length;

console.log(
  `Built file: ${builtSize} bytes (${(builtSize / 1024).toFixed(1)} KB)`
);
console.log(
  `Compression: ${(((originalSize - builtSize) / originalSize) * 100).toFixed(
    1
  )}% reduction`
);

// Estimate ZIP size (rough approximation)
const estimatedZip = builtSize * 0.3; // JS/HTML compresses well
console.log(`Estimated ZIP size: ~${(estimatedZip / 1024).toFixed(1)} KB`);
console.log(
  `JS13K budget remaining: ~${(13 - estimatedZip / 1024).toFixed(1)} KB`
);
