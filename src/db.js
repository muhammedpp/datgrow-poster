const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const dbFile = path.join(__dirname, '..', 'storage', 'db.json');

let db;

async function ensureDb() {
  const adapter = new JSONFile(dbFile);
  db = new Low(adapter, { templates: [], generated: [] });
  await db.read();
  db.data ||= { templates: [], generated: [] };
  await db.write();
}

function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

async function addTemplate(tpl) {
  const database = getDb();
  database.data.templates.push(tpl);
  await database.write();
}

function findTemplate(id) {
  const database = getDb();
  return database.data.templates.find(t => t.id === id);
}

async function addGenerated(entry) {
  const database = getDb();
  database.data.generated.push(entry);
  await database.write();
}

function findGenerated(id) {
  const database = getDb();
  return database.data.generated.find(g => g.id === id);
}

module.exports = { ensureDb, getDb, addTemplate, findTemplate, addGenerated, findGenerated };
