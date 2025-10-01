import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Já conectado ao MongoDB');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI não está definida nas variáveis de ambiente!');
    process.exit(1);
  }

  console.log('Tentando conectar ao MongoDB...');
  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log('Estado da conexão:', conn.connection.readyState);
    
    // Lista as collections disponíveis
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections disponíveis:', collections.map(c => c.name));
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};



export default connectDB;
