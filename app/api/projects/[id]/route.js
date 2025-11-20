import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import Prompt from '@/lib/models/Prompt';

// Helper to verify ownership
async function verifyOwnership(projectId, userId) {
  const project = await Project.findOne({ _id: projectId, userId });
  return project;
}

// 1. GET: Fetch Project Details & Stats
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const project = await verifyOwnership(id, session.user.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Get stats for this specific project workspace
    const promptCount = await Prompt.countDocuments({ projectId: id });
    const recentActivity = await Prompt.findOne({ projectId: id }).sort({ updatedAt: -1 }).select('updatedAt');

    return NextResponse.json({ 
      ...project.toObject(), 
      stats: {
        promptCount,
        lastActive: recentActivity?.updatedAt || project.createdAt
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 2. PATCH: Update Settings
export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const project = await verifyOwnership(id, session.user.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    if (body.name) project.name = body.name;
    if (body.description !== undefined) project.description = body.description;
    
    await project.save();
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// 3. DELETE: Nuke the Project
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const project = await verifyOwnership(id, session.user.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Delete all prompts associated with this project first (Clean up)
    await Prompt.deleteMany({ projectId: id });
    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}