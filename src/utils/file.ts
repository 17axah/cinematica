import { extname, resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';

export const createFile = async (src: string, file: Express.Multer.File) => {
  const ext = extname(file.originalname);
  const name = `${uuidv4()}${ext}`;
  const path = resolve(src, name);

  await writeFile(path, file.buffer);

  return name;
};
