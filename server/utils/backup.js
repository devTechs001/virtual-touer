import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

async function backupCollections(outDir = './backups', collections = []) {
  await fs.mkdir(outDir, { recursive: true });
  const result = {};
  for (const name of collections) {
    const model = mongoose.models[name] || mongoose.modelNames().includes(name) && mongoose.model(name);
    if (!model) continue;
    const docs = await model.find().lean();
    const file = path.join(outDir, `${name}.json`);
    await fs.writeFile(file, JSON.stringify(docs, null, 2));
    result[name] = file;
  }
  return result;
}

async function restoreCollections(fromDir = './backups', collections = []) {
  const result = {};
  for (const name of collections) {
    const file = path.join(fromDir, `${name}.json`);
    try {
      const raw = await fs.readFile(file, 'utf-8');
      const docs = JSON.parse(raw);
      const model = mongoose.models[name] || mongoose.model(name);
      if (!model) continue;
      // replace: delete existing and insert
      await model.deleteMany({});
      if (docs.length) await model.insertMany(docs);
      result[name] = { restored: docs.length };
    } catch (err) {
      result[name] = { error: err.message };
    }
  }
  return result;
}

export { backupCollections, restoreCollections };
