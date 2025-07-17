import createServer from './utils/server'
// src/index.ts (atau file entry point Hono kamu)
import dotenv from 'dotenv'; // Pastikan dotenv sudah diinstal (bun add dotenv)

// Ini adalah baris kunci: Muat variabel dari .env.production
dotenv.config({ path: '.env.production', override: true });

// Sekarang, variabel dari .env.production sudah ada di process.env
// Termasuk DATABASE_URL untuk Prisma.
console.log('DATABASE_URL yang digunakan:', process.env.DATABASE_URL);
console.log('NODE_ENV saat ini:', process.env.NODE_ENV); // Ini akan menjadi 'production' jika kamu export di terminal

// Lanjutkan inisialisasi Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const app = createServer()

export default {
  port: process.env.PORT ?? 3000,
  fetch: app.fetch,
  request: app.request,
  error(err: Error) {
    console.error(err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`)
