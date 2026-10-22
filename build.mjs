// Genera remoteEntry.json y el módulo expuesto; no usa Angular.
import { federationBuilder } from '@softarc/native-federation/build.js';
import { esBuildAdapter } from '@softarc/native-federation-esbuild';
import { copyFile, mkdir } from 'node:fs/promises';
await federationBuilder.init({
 options: { workspaceRoot: process.cwd(), outputPath: 'dist', tsConfig: 'tsconfig.json', federationConfig: 'federation.config.cjs', verbose: false },
 adapter: esBuildAdapter
});
await mkdir('dist', { recursive: true });
await federationBuilder.build();
await mkdir('dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
// Copia para probar directamente, sin shell ni Angular.
await copyFile('src/widget.js', 'dist/widget.js');
console.log('Generado dist/remoteEntry.json');


