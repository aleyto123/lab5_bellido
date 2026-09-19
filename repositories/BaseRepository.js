// repositories/BaseRepository.js
const fs = require("fs");
const path = require("path");

class BaseRepository {
  constructor(entity) {
    this.entity = entity;
    this.dbPath = path.join(__dirname, "..", "database", "db.json");
  }

  // Lee toda la base de datos desde el archivo JSON
  _readDB() {
    const data = fs.readFileSync(this.dbPath, "utf-8");
    return JSON.parse(data);
  }

  // Escribe el objeto completo en el archivo JSON
  _writeDB(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf-8");
  }

  // Devuelve todos los registros de la entidad
  findAll() {
    const db = this._readDB();
    return db[this.entity] || [];
  }

  // Busca un registro por su id
  findById(id) {
    const db = this._readDB();
    const items = db[this.entity] || [];
    return items.find((item) => item.id === id) || null;
  }

  // Crea un nuevo registro
  save(item) {
    const db = this._readDB();
    if (!db[this.entity]) db[this.entity] = [];
    db[this.entity].push(item);
    this._writeDB(db);
    return item;
  }

  // Actualiza un registro existente por id
  update(id, changes) {
    const db = this._readDB();
    const items = db[this.entity] || [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...changes };
    db[this.entity] = items;
    this._writeDB(db);
    return items[index];
  }

  // Elimina un registro por id
  delete(id) {
    const db = this._readDB();
    const items = db[this.entity] || [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const [deleted] = items.splice(index, 1);
    db[this.entity] = items;
    this._writeDB(db);
    return deleted;
  }
}

module.exports = BaseRepository;
