import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';

// 1. GET: List all projects
export async function GET(request) {
  await dbConnect();

  try {
    const MOCK_USER_ID = "user_123_mock"; 

    // Find all projects for this user, newest first
    const projects = await Project.find({ userId: MOCK_USER_ID })
      .sort({ updatedAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// 2. POST: Create a new project
export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const MOCK_USER_ID = "user_123_mock";

    const project = await Project.create({
      name: body.name,
      description: body.description,
      userId: MOCK_USER_ID,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 400 });
  }
}