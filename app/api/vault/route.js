import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';
import Project from '@/lib/models/Project';

// 1. GET: Fetch prompts for a project
export async function GET(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    // 🔒 Verify Ownership: Does this project belong to the user?
    const project = await Project.findOne({ _id: projectId, userId: session.user.id });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 403 });
    }

    const prompts = await Prompt.find({ projectId })
      .sort({ updatedAt: -1 });
      
    return NextResponse.json(prompts);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// 2. POST: Save a prompt
export async function POST(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 🔒 Verify Ownership
    const project = await Project.findOne({ _id: body.projectId, userId: session.user.id });
    
    if (!project) {
      return NextResponse.json({ error: 'Invalid Project ID' }, { status: 403 });
    }
    
    const newPrompt = await Prompt.create({
      title: body.title,
      originalPrompt: body.originalPrompt,
      optimizedPrompt: body.optimizedPrompt,
      snippet: body.optimizedPrompt.substring(0, 150),
      profession: body.profession,
      style: body.style,
      tags: body.tags || [],
      projectId: body.projectId, 
    });

    return NextResponse.json({ success: true, prompt: newPrompt }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to save prompt' }, { status: 500 });
  }
}