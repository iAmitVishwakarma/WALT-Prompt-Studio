import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Prompt from '@/lib/models/Prompt';

// 1. GET: Fetch User Profile & Stats
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Fetch User (explicitly include preferences)
    const user = await User.findById(session.user.id).select('-password -resetToken');
    
    // Calculate Real Stats
    const promptCount = await Prompt.countDocuments({ userId: session.user.id }); // Note: You might need to add userId to Prompt schema or filter via Projects
    // For MVP, we filter prompts by user's projects in Vault API, here we estimate.
    
    return NextResponse.json({
      profile: user,
      stats: {
        promptsThisMonth: promptCount, // Simplified for MVP
        promptsLimit: 50,
        vaultItems: promptCount,
        vaultLimit: 100,
        plan: 'free'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 2. PATCH: Update User Profile/Settings
export async function PATCH(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const user = await User.findById(session.user.id);

    // Update allowed fields
    const fields = ['name', 'profession', 'bio', 'location', 'website', 'preferences', 'customApiKey'];
    
    fields.forEach(field => {
      if (body[field] !== undefined) {
        user[field] = body[field];
      }
    });

    await user.save();
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// 3. DELETE: Delete Account
export async function DELETE() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Delete everything related to user
    // Note: In a real app, you'd cascade delete Projects/Prompts too
    await User.findByIdAndDelete(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}