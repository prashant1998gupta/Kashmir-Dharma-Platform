#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const I18N_FILE = path.join(ROOT, 'js/utils/i18n.js');
const SCAN_FILES = fs.readdirSync(path.join(ROOT, 'js/pages'))
    .map(file => path.join(ROOT, 'js/pages', file))
    .concat([
        path.join(ROOT, 'js/components.js'),
        path.join(ROOT, 'js/utils/profile-manager.js')
    ]);

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function collectUsedKeys() {
    const used = new Set();
    const keyPattern = /\b(?:I18n\.)?t\(\s*['"]([^'"`$]+)['"]/g;

    SCAN_FILES.forEach(file => {
        const source = read(file);
        for (const match of source.matchAll(keyPattern)) {
            if (!match[1].endsWith('.') && !match[1].endsWith('_')) {
                used.add(match[1]);
            }
        }
    });

    return used;
}

function collectLanguageKeys(lang, source) {
    const keys = new Set();
    const header = `${lang}: {`;
    let position = -1;

    while ((position = source.indexOf(header, position + 1)) !== -1) {
        let depth = 0;
        let end = position;
        let started = false;

        for (; end < source.length; end++) {
            const char = source[end];
            if (char === '{') {
                depth += 1;
                started = true;
            } else if (char === '}') {
                depth -= 1;
                if (started && depth === 0) {
                    end += 1;
                    break;
                }
            }
        }

        const block = source.slice(position, end);
        for (const match of block.matchAll(/['"]([^'"]+)['"]\s*:/g)) {
            keys.add(match[1]);
        }
    }

    return keys;
}

const usedKeys = collectUsedKeys();
const i18nSource = read(I18N_FILE);
const languages = ['en', 'hi'];
const missing = {};

languages.forEach(lang => {
    const languageKeys = collectLanguageKeys(lang, i18nSource);
    missing[lang] = Array.from(usedKeys).filter(key => !languageKeys.has(key)).sort();
});

const hasMissing = Object.values(missing).some(keys => keys.length > 0);
console.log(JSON.stringify({
    usedKeys: usedKeys.size,
    missing
}, null, 2));

if (hasMissing) {
    process.exit(1);
}
