// models/Prompt.js
import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  originalPrompt: {
    type: String,
    required: true,
  },
  optimizedPrompt: {
    type: String,
    required: true,
  },
  snippet: String,
  profession: {
    type: String,
    default: 'other',
  },
  style: {
    type: String,
    default: 'custom',
  },
  tags: [String],
  version: {
    type: Number,
    default: 1,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema);