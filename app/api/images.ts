// pages/api/images.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { start, end } = req.query;
  const startIndex = parseInt(start as string, 10);
  const endIndex = parseInt(end as string, 10);
  
  // Simulating fetching images based on the start and end index
  const images = Array.from({ length: endIndex - startIndex }, (_, i) => i + startIndex + 1);
  
  res.status(200).json(images);
}
