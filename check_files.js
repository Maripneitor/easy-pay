const fs = require('fs');
const path = require('path');

const root = 'c:\\Users\\mario\\OneDrive\\Documentos\\Proyectos\\EASY-PAY';
const paths = [
    path.join(root, 'node_modules/expo/package.json'),
    path.join(root, 'apps/mobile-app/node_modules/expo/package.json'),
    path.join(root, 'node_modules/nativewind/package.json'),
    path.join(root, 'apps/mobile-app/node_modules/nativewind/package.json'),
    path.join(root, 'node_modules/expo/tsconfig.base/tsconfig.json'),
];

paths.forEach(p => {
    console.log(`${p}: ${fs.existsSync(p) ? 'EXISTS' : 'MISSING'}`);
});
