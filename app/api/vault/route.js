import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';
import Project from '@/lib/models/Project';

// 1. GET: Fetch prompts (Global or Project-specific)
export async function GET(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    let query = {};
    
    if (projectId) {
      // 🔒 Verify Ownership of specific project
      const project = await Project.findOne({ _id: projectId, userId: session.user.id });
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 403 });
      }
      query.projectId = projectId;
    } else {
      // 🔓 Global Fetch: Find all projects owned by user to get their IDs
      // (Prompts store projectId, but we need to ensure we only fetch prompts for YOUR projects)
      const userProjects = await Project.find({ userId: session.user.id }).select('_id');
      const userProjectIds = userProjects.map(p => p._id);
      
      query.projectId = { $in: userProjectIds };
    }

    // Optimization: Select only necessary fields for list view
    const prompts = await Prompt.find(query)
      .select('title snippet profession style tags version createdAt projectId') 
      .sort({ updatedAt: -1 });
      
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Vault API Error:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// 2. POST: Save a prompt (Unchanged - requires Project ID)
export async function POST(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.projectId) {
       return NextResponse.json({ error: 'Saving requires a Project context' }, { status: 400 });
    }

    const project = await Project.findOne({ _id: body.projectId, userId: session.user.id });
    
    if (!project) {
      return NextResponse.json({ error: 'Invalid Project ID' }, { status: 403 });
    }
    
    const newPrompt = await Prompt.create({
      title: body.title,
      originalPrompt: body.originalPrompt,
      optimizedPrompt: body.optimizedPrompt,
      snippet: body.optimizedPrompt ? body.optimizedPrompt.substring(0, 150) + "..." : "",
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