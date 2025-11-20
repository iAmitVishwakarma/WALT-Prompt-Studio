import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import PromptImproviser from "@/lib/service/PromptImpro";
import Prompt from "@/lib/models/Prompt";
import Project from "@/lib/models/Project";
import { Tag } from "lucide-react";

export async function POST(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, profession, style, projectId, context } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error (API Key)" },
        { status: 500 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 1. Context Awareness ("Project Memory")
    let projectContext = "";
    if (projectId) {
      try {
        // 🔒 Security: Ensure user owns this project before reading its context
        const project = await Project.findOne({
          _id: projectId,
          userId: session.user.id,
        });

        if (project) {
          const recentPrompts = await Prompt.find({ projectId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select("optimizedPrompt");

          if (recentPrompts.length > 0) {
            projectContext = `
  CONTEXT FROM PREVIOUS PROJECT WORK:
  The user is working in a project where they have already generated the following prompts. 
  Use these as a reference for the desired tone, complexity, and structure.
  ${recentPrompts
    .map(
      (p, i) => `Example ${i + 1}: ${p.optimizedPrompt.substring(0, 300)}...`
    )
    .join("\n")}
  `;
          }
        }
      } catch (err) {
        console.warn("Context fetch warning:", err);
      }
    }

    // 2. System Prompt Construction
    const systemInstruction = `
    You are an elite Prompt Engineer and AI Optimization Assistant.
    Your goal is to rewrite the user's raw prompt into a highly effective, professional prompt optimized for LLMs.

    ---
    TARGET AUDIENCE/ROLE: ${profession}
    FRAMEWORK: ${style.toUpperCase()}
    ---

    FRAMEWORK DEFINITIONS:
    - WALT: Who, Action, Limitation, Tone.
    - RACE: Role, Action, Context, Expectation.
    - CCE: Context, Constraint, Example.
    - CUSTOM: General best practices.

    REQUIREMENTS:
    ${context?.examples ? "- Include specific examples." : ""}
    ${context?.constraints ? "- Define clear constraints." : ""}
    ${context?.tone ? "- Explicitly define tone." : ""}
    ${context?.format ? "- Specify output format." : ""}

    ${projectContext}

    INSTRUCTIONS:
    Return ONLY the optimized prompt text. No intro/outro.
    Give title in 50 characters or less in first line.
    and give tags in last line like this in this format: [#tag1, #tag2, #tag3]
    `;

    const optimizedResult = await PromptImproviser({
      prompt,
      systemInstruction,
    });
    // console.log("Optimized Result:", optimizedResult);

    const lines = optimizedResult.split("\n");
    const title = lines[0];
    const tagsLine = optimizedResult.match(/#\w+/g).map(tag => tag.replace("#", ""));
    const optimizedPromptBody = lines
      .slice(1, -1) // remove first and last line
      .filter((line) => !line.startsWith("[")) // exclude tag lines
      .join("\n"); // join back into a string

    // 3. Usage Stats
    const tokens = Math.ceil(
      (systemInstruction.length + prompt.length + optimizedPromptBody.length) / 4
    );
    const costUsd = tokens * 0.0000005; // Simplified calc

    // save in database
    const newPrompt = await Prompt.create({
      title: title || "Untitled Prompt",
      originalPrompt: prompt,
      optimizedPrompt: optimizedPromptBody.trim(),
      snippet: optimizedPromptBody.substring(0, 150) + "...",
      profession,
      style,
      tags: tagsLine || [],
      projectId,
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      original: prompt,
      optimized: optimizedResult.trim(),
      tokensUsed: tokens,
      costUsd: parseFloat(costUsd.toFixed(8)),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Optimization Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to optimize prompt",
      },
      { status: 500 }
    );
  }
}
