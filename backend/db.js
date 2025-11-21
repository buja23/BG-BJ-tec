import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI não está definida nas variáveis de ambiente!');
    process.exit(1);
  }

  console.log('Tentando conectar ao MongoDB...');
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
