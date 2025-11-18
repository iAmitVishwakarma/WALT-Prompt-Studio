// app/api/vault/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    const prompts = await Prompt.find({ projectId })
      .sort({ updatedAt: -1 });
      
    return NextResponse.json(prompts);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    
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