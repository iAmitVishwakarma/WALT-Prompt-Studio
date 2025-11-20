import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';
import Project from '@/lib/models/Project';

// Helper to verify ownership
async function verifyOwnership(promptId, userId) {
  const prompt = await Prompt.findById(promptId);
  if (!prompt) return null;

  // Check if the project belongs to the user
  const project = await Project.findOne({ 
    _id: prompt.projectId, 
    userId: userId 
  });

  if (!project) return null;
  
  return prompt;
}

// 1. GET: Fetch a single prompt
export async function GET(request, { params }) {
  await dbConnect();
  
  // Await params (Next.js 15/16 requirement)
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const prompt = await verifyOwnership(id, session.user.id);
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// 2. DELETE: Remove a prompt
export async function DELETE(request, { params }) {
  await dbConnect();
  
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const prompt = await verifyOwnership(id, session.user.id);
    
    if (!prompt) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await Prompt.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Prompt deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}