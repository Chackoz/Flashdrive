// utils/fetchImages.ts

import fs from 'fs';
import path from 'path';

export const fetchImages = (): string[] => {
  const publicDir = path.join(process.cwd(), 'public');
  const imageDir = path.join(publicDir, 'images');

  const allFiles = fs.readdirSync(imageDir);

  const imagePaths = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  }).map(file => `/art/${file}`);

  return imagePaths;
};
