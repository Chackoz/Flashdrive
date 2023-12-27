// utils/fetchImages.ts

import fs from 'fs';
import path from 'path';

export const fetchImages = (): string[] => {
  const publicDir = path.join(process.cwd(), 'public');
  const imageDir = path.join(publicDir, 'images');
  
  // Read all files in the 'images' directory
  const allFiles = fs.readdirSync(imageDir);

  // Filter out only image files
  const imagePaths = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  }).map(file => `/art/${file}`);

  return imagePaths;
};
