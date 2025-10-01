import UsuarioModel from './UsuarioSchema.js';

class Usuario {
  constructor(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.cargo = null; // definido na subclasse
  }

  //aa
  async save() {
    const doc = new UsuarioModel({
      nome:  this.nome,
      email: this.email,
      senha: this.senha,
      cargo: this.cargo
    });
    return await doc.save();
  }

  static async findAll() {
    return await UsuarioModel.find();
  }
  static async findById(id) {
    return await UsuarioModel.findById(id);
  }
  static async update(id, data) {
    return await UsuarioModel.findByIdAndUpdate(id, data, { new: true });
  }
  static async delete(id) {
    return await UsuarioModel.findByIdAndDelete(id);
  }
}

export default Usuario;