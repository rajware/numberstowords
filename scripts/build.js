import fs, { copyFile } from 'node:fs';

const cleanDistDir = () => {
    fs.rmSync('./dist', { recursive: true, force: true });
};

const ensureDistDir = () => {
    fs.mkdirSync('./dist', { recursive: true });
};

const copyTypeFiles = () => {
    fs.copyFileSync('./types/numberstowords.d.ts', './dist/numberstowords.d.ts');
    fs.copyFileSync('./types/numberstowords.d.cts', './dist/numberstowords.d.cts');
};

const action = process.argv[2];
switch (action) {
    case "clean":
        cleanDistDir();
        break;
    case "copytypes":
        ensureDistDir();
        copyTypeFiles();
        break;
    default:
        console.info('Usage: node build.js clean|copytypes');
};