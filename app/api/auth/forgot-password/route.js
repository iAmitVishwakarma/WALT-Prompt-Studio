import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Security: Don't reveal if user exists or not, just say "If email exists..."
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }

    // 1. Generate Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Token expires in 1 hour
    const resetTokenExpiry = Date.now() + 3600000; 

    // 2. Save to DB
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // 3. "Send" Email (Mocking for MVP)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    
    console.log("========================================");
    console.log("📧 MOCK EMAIL SERVICE");
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Password`);
    console.log(`Link: ${resetUrl}`);
    console.log("========================================");

    return NextResponse.json({ success: true, message: "Reset link sent (check server console)" });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}