import mongoose from 'mongoose';

const webhookSchema = new mongoose.Schema({
  url: { type: String, required: true },
  events: [{ type: String }],
  active: { type: Boolean, default: true },
  lastStatus: { code: Number, body: mongoose.Schema.Types.Mixed, at: Date }
}, { timestamps: true });

const Webhook = mongoose.model('Webhook', webhookSchema);
export default Webhook;
