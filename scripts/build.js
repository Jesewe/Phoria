const fs = require('fs');
const path = require('path');

// Read configuration
const configPath = path.join(__dirname, '..', 'src', 'config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract metadata from config
const metadataMatch = configContent.match(/export const USERSCRIPT_METADATA = ({[\s\S]*?});/);
if (!metadataMatch) {
    console.error('Could not find USERSCRIPT_METADATA in config.js');
    process.exit(1);
}

const metadata = eval('(' + metadataMatch[1] + ')');

// Generate userscript header
function generateHeader(metadata) {
    let header = '// ==UserScript==\n';
    
    for (const [key, value] of Object.entries(metadata)) {
        if (Array.isArray(value)) {
            value.forEach(item => {
                header += `// @${key.padEnd(12)} ${item}\n`;
            });
        } else {
            header += `// @${key.padEnd(12)} ${value}\n`;
        }
    }
    
    header += '// ==/UserScript==\n\n';
    return header;
}

// Read and process all source files
function readSourceFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Remove export/import statements and keep only the code
    return content
        .replace(/export\s+/g, '')
        .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '')
        .replace(/import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '')
        .trim();
}

// Build the complete userscript
function build() {
    console.log('Building Phoria userscript...');

    const srcDir = path.join(__dirname, '..', 'src');
    const distDir = path.join(__dirname, '..', 'dist');
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // Read all source files in order
    const files = [
        'config.js',
        'i18n/locales.js',
        'utils/download.js',
        'utils/username.js',
        'utils/postId.js',
        'services/imageCollector.js',
        'services/bulkDownloader.js',
        'ui/downloadButton.js',
        'ui/bulkDownloadButton.js',
        'ui/modal.js',
        'main.js'
    ];

    let bundledCode = '';

    files.forEach(file => {
        const filePath = path.join(srcDir, file);
        const content = readSourceFile(filePath);
        bundledCode += `// ${file}\n${content}\n\n`;
    });

    // Generate final userscript
    const header = generateHeader(metadata);
    const finalScript = header + bundledCode;

    // Write to dist folder
    const outputPath = path.join(distDir, 'Phoria.user.js');
    fs.writeFileSync(outputPath, finalScript, 'utf8');

    console.log(`✓ Build complete: ${outputPath}`);
    console.log(`  Size: ${(finalScript.length / 1024).toFixed(2)} KB`);
}

// Watch mode
function watch() {
    console.log('Watching for changes...');
    const srcDir = path.join(__dirname, '..', 'src');
    
    fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.js')) {
            console.log(`\nDetected change in ${filename}`);
            build();
        }
    });
    
    build(); // Initial build
}

// Check for watch flag
const args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
    watch();
} else {
    build();
}