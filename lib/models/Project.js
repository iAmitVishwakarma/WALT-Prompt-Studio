// models/Project.js
import mongoose from 'mongoose';
import { ref } from 'process';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  userId: {
    type: String, // Using String for Mock ID compatibility
    required: true,
    ref: 'User',
    required: true,
    index: true
  },

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Compound index: A user cannot have two projects with the same name
ProjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);