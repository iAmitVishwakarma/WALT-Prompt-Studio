import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  originalPrompt: {
    type: String,
    required: [true, 'Original prompt is required'],
  },
  optimizedPrompt: {
    type: String,
    required: [true, 'Optimized prompt is required'],
  },
  snippet: String,
  profession: {
    type: String,
    default: 'other',
    index: true, // Filter index
  },
  style: {
    type: String,
    default: 'custom',
    index: true, // Filter index
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
    index: true, // Crucial for querying project prompts
  },
}, {
  timestamps: true,
});

export default mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema);