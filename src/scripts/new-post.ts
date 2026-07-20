import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = createInterface({ input, output });

const title = (await rl.question('Titulo: ')).trim();
if (!title) throw new Error('Titulo requerido.');
const description = (await rl.question('Descripcion: ')).trim();
if (!description) throw new Error('Descripcion requerida.');
rl.close();

const slug = title
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const date = new Date().toISOString().slice(0, 10);
const filePath = join(process.cwd(), 'src', 'content', 'posts', `${slug}.md`);
if (existsSync(filePath)) throw new Error(`Ya existe ${filePath}`);

const frontmatter = `---
title: "${title.replaceAll('"', '\\"')}"
description: "${description.replaceAll('"', '\\"')}"
date: ${date}
updatedDate: ${date}
author: "D-Consultores"
tags: []
cover:
  src: "./images/${slug}.webp"
  alt: "Imagen principal de ${title.replaceAll('"', '\\"')}"
draft: true
---

Escribe el contenido de la publicacion.
`;

mkdirSync(dirname(filePath), { recursive: true });
writeFileSync(filePath, frontmatter, { flag: 'wx' });
console.log(`Creado: ${filePath}`);
