// backend/src/routes/produtoRoutes.js

import express from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import __dirname from '../utils/pathUtils.js';
import { getAllProdutos, getProdutoById, createProduto, updateProduto, deleteProduto } from "../controllers/ProdutoController.js";

const router = express.Router();

// --- CONFIGURAÇÃO DO MULTER DIRETAMENTE AQUI ---
// Garante que o diretório de uploads exista
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rota base será /api/produtos
router.get('/', getAllProdutos);
router.get('/:id', getProdutoById);
router.post('/', upload.single('imagem'), createProduto);
router.put('/:id', upload.single('imagem'), updateProduto);
router.delete('/:id', deleteProduto);

export default router;
