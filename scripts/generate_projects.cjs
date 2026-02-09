const fs = require('fs');
const path = require('path');

// Configuration
const ACADEMIC_ROOT = 'G:\\Mi unidad\\Documentos\\CV\\Academic projects';
const ASSETS_ROOT = 'G:\\Mi unidad\\Documentos\\CV\\Portfolio_Assets';

const OUTPUT_FILE = path.resolve(__dirname, '..', 'src', 'data', 'projects.json');
const PUBLIC_ASSETS_DIR = path.resolve(__dirname, '..', 'public', 'assets');

// Ensure output dirs exist
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(PUBLIC_ASSETS_DIR)) fs.mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });

function scanProjects(dir, relativeRootString = "") {
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        return [];
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });
    const structure = [];

    for (const item of items) {
        if (item.name.startsWith('.') || item.name === 'desktop.ini') continue;

        const fullPath = path.join(dir, item.name);

        // Logic: specific to files
        let webPath = fullPath; // Default fallback

        // If it's a file, we want to copy it to public/assets to make it accessible
        if (!item.isDirectory()) {
            // Create a safe sub-path for the asset based on its parent folder name or relative path
            // For simplicity, we'll maintain the structure relative to the root being scanned
            // relativeRootString comes from recursive calls

            // BUT simpler strategy: Just flatten/copy by filename? No, collisions.
            // Strategy: Mirror the directory structure inside public/assets

            const relativePathFromRoot = path.relative(item.path.includes('Academic') ? ACADEMIC_ROOT : ASSETS_ROOT, fullPath);
            const destPath = path.join(PUBLIC_ASSETS_DIR, relativePathFromRoot);

            // Ensure dest dir exists
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                console.log(`Creating directory: ${destDir}`);
                fs.mkdirSync(destDir, { recursive: true });
            }

            // Copy file if it doesn't exist or is newer
            try {
                if (!fs.existsSync(destPath) || fs.statSync(fullPath).mtime > fs.statSync(destPath).mtime) {
                    console.log(`Copying asset: ${item.name} -> ${destPath}`);
                    fs.copyFileSync(fullPath, destPath);
                } else {
                    console.log(`Skipping existing asset: ${item.name}`);
                }
            } catch (err) {
                console.error(`Error copying ${item.name}:`, err.message);
            }

            // Web path is relative to public folder
            // Windows paths backslashes to forward slashes
            // Use encodeURI to handle spaces in filenames
            const rawWebPath = '/assets/' + relativePathFromRoot.replace(/\\/g, '/');
            webPath = encodeURI(rawWebPath);
        }

        const node = {
            name: item.name,
            type: item.isDirectory() ? 'folder' : 'file',
            path: webPath,
            children: []
        };

        if (item.isDirectory()) {
            // Recurse
            node.children = scanProjects(fullPath);
        }

        structure.push(node);
    }
    return structure;
}

console.log(`Scanning Academic projects from: ${ACADEMIC_ROOT}`);
const academicData = scanProjects(ACADEMIC_ROOT);

console.log(`Scanning Portfolio assets from: ${ASSETS_ROOT}`);
const assetsData = scanProjects(ASSETS_ROOT);

// Combine them into a categorized structure
const combinedData = [
    {
        name: "Academic Projects",
        type: "section",
        children: academicData
    },
    {
        name: "Professional Portfolio",
        type: "section",
        children: assetsData
    }
];

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(combinedData, null, 2));
console.log(`Project index generated at: ${OUTPUT_FILE}`);
