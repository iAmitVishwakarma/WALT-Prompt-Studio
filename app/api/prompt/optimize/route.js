import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/db';
import PromptImproviser from '@/lib/service/PromptImpro';
import Prompt from '@/lib/models/Prompt';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { prompt, profession, style, projectId, context } = body;

    // 1. Validation
    if (!process.env.GEMINI_API_KEY) {
        console.log('GEMINI_API_KEY is missing in environment variables');
      return NextResponse.json({ 
        success: false, 
        error: 'GEMINI_API_KEY is missing in .env file' 
      }, { status: 500 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log(`Optimizing prompt for profession: ${profession}, style: ${style}` , context, projectId);
    console.log("Original Prompt:", prompt);
    // 2. Context Awareness ("Project Memory")
    let projectContext = "";
    if (projectId) {
      try {
        // Fetch last 3 prompts from this project to understand the user's style
        const recentPrompts = await Prompt.find({ projectId })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('optimizedPrompt');
        
        if (recentPrompts.length > 0) {
          projectContext = `
CONTEXT FROM PREVIOUS PROJECT WORK:
The user is working in a project where they have already generated the following prompts. 
Use these as a reference for the desired tone, complexity, and structure, but prioritize the specific instructions for the NEW request.
${recentPrompts.map((p, i) => `Example ${i+1}: ${p.optimizedPrompt.substring(0, 300)}...`).join('\n')}
`;
        }
      } catch (err) {
        console.warn("Failed to fetch project context", err);
        // Fail silently on context fetch so we can still optimize the main prompt
      }
    }

    // 3. Construct the System Prompt for Gemini
    const systemInstruction = `
    You are an elite Prompt Engineer and AI Optimization Assistant.
    Your goal is to rewrite the user's raw prompt into a highly effective, professional prompt optimized for LLMs (like GPT-4, Claude, Gemini).

    ---
    TARGET AUDIENCE/ROLE: ${profession}
    FRAMEWORK TO USE: ${style.toUpperCase()}
    ---

    FRAMEWORK DEFINITIONS:
    - WALT: Who (Persona), Action (Task), Limitation (Constraints), Tone (Style).
    - RACE: Role, Action, Context, Expectation.
    - CCE: Context, Constraint, Example.
    - CUSTOM: Use general best practices for the ${profession} profession.

    USER REQUIREMENTS:
    ${context?.examples ? "- Must include specific examples in the prompt." : ""}
    ${context?.constraints ? "- Must define clear constraints (length, format, etc)." : ""}
    ${context?.tone ? "- Must explicitly define the communication tone." : ""}
    ${context?.format ? "- Must specify the output format (markdown, code, list, etc)." : ""}

    ${projectContext}

    INSTRUCTIONS:
    1. Analyze the user's raw prompt.
    2. Expand it using the selected ${style} framework.
    3. Enhance it with profession-specific keywords.
    4. Return ONLY the optimized prompt text. Do not include introductions like "Here is your prompt".
    `;

    // 4. Call Gemini API
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // const result = await model.generateContent([
    //     systemInstruction, 
    //     `RAW PROMPT: "${prompt}"`
    // ]);
 





    const optimizedResult = await PromptImproviser({prompt,systemInstruction});

    // 5. Calculate Usage Stats (Estimates for Gemini 1.5 Flash)
    const inputLength = systemInstruction.length + prompt.length;
    const outputLength = optimizedResult.length;
    
    // Rough token estimate (1 token ~= 4 chars)
    const tokens = Math.ceil((inputLength + outputLength) / 4);
    
    // Pricing (approximate based on current Gemini Flash rates)
    // ~$0.00001875/1k chars input, ~$0.000075/1k chars output
    const costUsd = (inputLength * 0.000000018) + (outputLength * 0.000000075); 

    return NextResponse.json({
      success: true,
      original: prompt,
      optimized: optimizedResult.trim(),
      tokensUsed: tokens,
      costUsd: parseFloat(costUsd.toFixed(8)), // High precision for micro-costs
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to optimize prompt' 
    }, { status: 500 });
  }
}