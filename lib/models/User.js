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

    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
