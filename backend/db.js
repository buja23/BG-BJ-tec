import mongoose from "mongoose";

const connectDB = async () => {
    try{
        //env
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("MongoDB conectado com sucesso!");
    }catch(error){
        console.error("Erro ao conectar ao MongoDB", error);
        process.exit(1); // encerra o processo com erro
    }
}

export default connectDB;