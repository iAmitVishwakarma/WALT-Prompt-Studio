import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import your auth config
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';

// 1. GET: List MY projects
export async function GET(request) {
  await dbConnect();
  
  // 🔒 Security Check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Only find projects belonging to THIS user
    const projects = await Project.find({ userId: session.user.id })
      .sort({ updatedAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// 2. POST: Create a new project for ME
export async function POST(request) {
  await dbConnect();

  // 🔒 Security Check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const project = await Project.create({
      name: body.name,
      description: body.description,
      userId: session.user.id, // Attach to real user
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 400 });
  }
}