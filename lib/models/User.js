import mongoose from "mongoose";
import disposableDomains from "disposable-email-domains"; // array of domains

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (value) {
          const domain = value.split("@")[1];
          return !disposableDomains.includes(domain);
        },
        message: "Disposable email addresses are not allowed.",
      },
    },
    password: { type: String, required: true, select: false },
    image: { type: String },

// Profile Fields
  profession: { type: String, default: 'other' },
  bio: { type: String, maxlength: 500 },
  location: { type: String },
  website: { type: String },

// Settings
  customApiKey: { type: String, select: false }, // Encrypt in real app, hidden by default
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    promptSuggestions: { type: Boolean, default: true },
    autoSave: { type: Boolean, default: true },
    defaultFramework: { type: String, default: 'walt' },
    theme: { type: String, default: 'dark' }
  },


    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
