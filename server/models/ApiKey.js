import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  scopes: [String],
  active: { type: Boolean, default: true }
}, { timestamps: true });

apiKeySchema.statics.generate = function(name = 'key', scopes = []) {
  const key = crypto.randomBytes(32).toString('hex');
  return this.create({ name, key, scopes });
};

const ApiKey = mongoose.model('ApiKey', apiKeySchema);
export default ApiKey;
