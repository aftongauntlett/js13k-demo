const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

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

${orbitalSystemJs}

${audioSystemJs}

${gameJs}
`;

// Minify JavaScript with Terser
async function buildOptimized() {
  try {
    const minified = await minify(allJs, {
      mangle: {
        toplevel: true,
        properties: {
          regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
        },
      },
      compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"],
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
      },
    });

    if (minified.error) {
      throw minified.error;
    }

    // Replace the script tags in HTML with the minified JavaScript

    // Find the start and end markers more reliably
    const startMarker = "<!-- Component Scripts -->";
    const endMarker = "<!-- Game Initialization -->";

    const startIndex = htmlTemplate.indexOf(startMarker);
    const endIndex = htmlTemplate.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error(
        `Could not find HTML markers. Start: ${startIndex}, End: ${endIndex}`
      );
    }

    const beforeSection = htmlTemplate.substring(0, startIndex);
    const afterSection = htmlTemplate.substring(endIndex + endMarker.length);

    // Find the actual minified class name for the main game
    // Look for the class that has the constructor with gameCanvas
    const gameClassMatch = minified.code.match(
      /class\s+(\w+)\s*\{[^}]*getElementById\s*\(\s*['""]gameCanvas['""][^}]*\}/
    );
    const gameClassName = gameClassMatch ? gameClassMatch[1] : "G"; // fallback to G if not found

    const replacement = `<!-- All Combined & Minified JavaScript -->
  <script>
${minified.code}

// Initialize the golfed game
window.game = new ${gameClassName}();
window.tutorial = window.game.tutorial; // Make tutorial globally accessible
  </script>`;

    let builtHtml = beforeSection + replacement + afterSection;

    // Replace any remaining references to the original class name with the minified one
    builtHtml = builtHtml.replace(/new G\(\)/g, `new ${gameClassName}()`);

    // Ensure dist directory exists
    const distDir = path.join(__dirname, "../dist");
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Write the built file
    fs.writeFileSync(path.join(__dirname, "../dist/index.html"), builtHtml);

    // Calculate sizes
    const originalSize = htmlTemplate.length + allJs.length;
    const builtSize = builtHtml.length;

    console.log(
      `Built file: ${builtSize} bytes (${(builtSize / 1024).toFixed(1)} KB)`
    );
    console.log(
      `Compression: ${(
        ((originalSize - builtSize) / originalSize) *
        100
      ).toFixed(1)}% reduction`
    );

    // Estimate ZIP size (rough approximation)
    const estimatedZip = builtSize * 0.25; // Better compression with minification
    console.log(`Estimated ZIP size: ~${(estimatedZip / 1024).toFixed(1)} KB`);
    console.log(
      `JS13K budget remaining: ~${(13 - estimatedZip / 1024).toFixed(1)} KB`
    );
  } catch (error) {
    console.error("Minification failed:", error);
    // Fallback to unminified
    const builtHtml = htmlTemplate.replace(
      /<!-- Component Scripts -->[\s\S]*?<!-- Game Initialization -->/,
      `<!-- All Combined JavaScript (fallback) -->
  <script>
${allJs}

// Initialize the golfed game
window.game = new G();
window.tutorial = window.game.tutorial; // Make tutorial globally accessible
  </script>`
    );

    // Ensure dist directory exists
    const distDir = path.join(__dirname, "../dist");
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    fs.writeFileSync(path.join(__dirname, "../dist/index.html"), builtHtml);
  }
}

buildOptimized();
