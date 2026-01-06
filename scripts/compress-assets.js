const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = 'assets/images';
const subDirs = ['concepts', 'explainers', 'pathways', 'ui'];

(async () => {
    let totalSaved = 0;
    console.log('Starting compression...');

    for (const sub of subDirs) {
        const dirPath = path.join(baseDir, sub);
        if (!fs.existsSync(dirPath)) continue;

        console.log(`Processing ${sub}...`);
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const originalStat = fs.statSync(filePath);
            const originalSize = originalStat.size;

            try {
                const buffer = fs.readFileSync(filePath);
                // Using palette: true forces 8-bit quantization (like pngquant)
                const outputBuffer = await sharp(buffer)
                    .png({ quality: 65, compressionLevel: 9, palette: true })
                    .toBuffer();

                const newSize = outputBuffer.length;

                if (newSize < originalSize) {
                    fs.writeFileSync(filePath, outputBuffer);
                    const saved = originalSize - newSize;
                    totalSaved += saved;
                    console.log(`  ✓ ${file}: ${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB`);
                } else {
                    console.log(`  - ${file}: No reduction (original served)`);
                }
            } catch (err) {
                console.error(`  X Error processing ${file}:`, err.message);
            }
        }
    }

    console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
})();
