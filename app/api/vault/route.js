/**
 * ============================================
 * VAULT API (Mock - In-Memory Storage)
 * ============================================
 * 
 * This is a MOCK endpoint for MVP testing.
 * Data is stored in-memory and will reset on server restart.
 * 
 * GET /api/vault
 * - Returns all saved prompts
 * 
 * POST /api/vault
 * - Saves a new prompt or updates existing version
 * 
 * DELETE /api/vault?id={promptId}
 * - Deletes a prompt (optional)
 * 
 * TODO for Production:
 * - Replace with real database (Postgres, MongoDB, etc.)
 * - Add user authentication & authorization
 * - Add pagination for large vaults
 * - Add tags indexing for faster search
 * - Add version control with history tracking
 */

import { NextResponse } from 'next/server';

// ============================================
// IN-MEMORY DATA STORE (resets on restart)
// ============================================

let vaultStore = [
  // Pre-populated sample data for demo
  {
    id: 'vault_001',
    title: 'E-commerce Product Description',
    originalPrompt: 'Write a product description',
    optimizedPrompt: 'As a Marketer, create a compelling product description that highlights key benefits, uses persuasive language, targets the ideal customer persona, and includes a clear call-to-action. Guidelines: 1. Focus on target audience and messaging, 2. Consider conversion optimization, 3. Include metrics and KPIs, 4. Think about brand voice and positioning.',
    snippet: 'As a Marketer, create a compelling product description that highlights key benefits, uses persuasive language...',
    profession: 'marketer',
    style: 'race',
    tags: ['ecommerce', 'copywriting', 'conversion', 'marketing'],
    version: 1,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'vault_002',
    title: 'React Component Documentation',
    originalPrompt: 'Document a React component',
    optimizedPrompt: 'As a Developer, your task is to document a React component with comprehensive JSDoc comments, prop types, usage examples, and edge cases. Guidelines: 1. Consider best practices and code quality, 2. Include relevant technology stack details, 3. Think about scalability and maintainability, 4. Follow industry-standard patterns.',
    snippet: 'As a Developer, your task is to document a React component with comprehensive JSDoc comments, prop types...',
    profession: 'developer',
    style: 'walt',
    tags: ['react', 'documentation', 'typescript', 'frontend'],
    version: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Updated 1 day ago
  },
  {
    id: 'vault_003',
    title: 'Landing Page Wireframe Brief',
    originalPrompt: 'Create a landing page wireframe',
    optimizedPrompt: 'As a Designer, create a landing page wireframe focusing on user experience and visual hierarchy. Context: Working as a Designer, the objective is to create a landing page wireframe. Guidelines: 1. Emphasize user experience and aesthetics, 2. Consider accessibility and usability, 3. Think about visual hierarchy, 4. Include design principles and guidelines.',
    snippet: 'As a Designer, create a landing page wireframe focusing on user experience and visual hierarchy...',
    profession: 'designer',
    style: 'cce',
    tags: ['design', 'wireframe', 'ux', 'landing-page'],
    version: 1,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'vault_004',
    title: 'Blog Post Outline - AI Trends',
    originalPrompt: 'Write a blog post about AI trends',
    optimizedPrompt: 'As a Writer, I need you to write a blog post about AI trends with engaging storytelling, data-driven insights, and clear structure. Guidelines: 1. Focus on clarity and engagement, 2. Consider tone and audience, 3. Think about structure and flow, 4. Include storytelling elements.',
    snippet: 'As a Writer, I need you to write a blog post about AI trends with engaging storytelling, data-driven insights...',
    profession: 'writer',
    style: 'race',
    tags: ['content', 'blog', 'ai', 'trends'],
    version: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'vault_005',
    title: 'Sales Dashboard Requirements',
    originalPrompt: 'Define requirements for a sales dashboard',
    optimizedPrompt: 'From the perspective of a Product Manager, define requirements for a sales dashboard including KPIs, stakeholder needs, and success metrics. Guidelines: 1. Focus on stakeholder alignment, 2. Consider team dynamics and resources, 3. Think about ROI and business impact, 4. Include risk mitigation strategies.',
    snippet: 'From the perspective of a Product Manager, define requirements for a sales dashboard including KPIs...',
    profession: 'manager',
    style: 'custom',
    tags: ['product', 'requirements', 'dashboard', 'analytics'],
    version: 1,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Counter for generating unique IDs
let idCounter = vaultStore.length + 1;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique ID
 */
function generateId() {
  return `vault_${String(idCounter++).padStart(3, '0')}`;
}

/**
 * Generate snippet from optimized prompt (first 150 chars)
 */
function generateSnippet(text) {
  if (!text) return '';
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
}

/**
 * Find prompt by ID
 */
function findPromptById(id) {
  return vaultStore.find(prompt => prompt.id === id);
}

/**
 * Validate prompt data
 */
function validatePromptData(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!data.optimizedPrompt || typeof data.optimizedPrompt !== 'string') {
    errors.push('Optimized prompt is required');
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }

  return errors;
}

// ============================================
// GET - RETRIEVE ALL PROMPTS
// ============================================

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Get single prompt by ID
    if (id) {
      const prompt = findPromptById(id);
      
      if (!prompt) {
        return NextResponse.json(
          { success: false, error: 'Prompt not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        prompt,
      });
    }

    // Get all prompts (sorted by updatedAt, newest first)
    const sortedPrompts = [...vaultStore].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return NextResponse.json(sortedPrompts);

  } catch (error) {
    console.error('Vault GET error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve prompts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST - CREATE OR UPDATE PROMPT
// ============================================

export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      id,
      title,
      originalPrompt = '',
      optimizedPrompt,
      profession = 'other',
      style = 'custom',
      tags = [],
    } = body;

    // Validate data
    const validationErrors = validatePromptData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          errors: validationErrors 
        },
        { status: 400 }
      );
    }

    // Check if updating existing prompt
    if (id) {
      const existingPrompt = findPromptById(id);
      
      if (!existingPrompt) {
        return NextResponse.json(
          { success: false, error: 'Prompt not found for update' },
          { status: 404 }
        );
      }

      // Update existing prompt (increment version)
      const updatedPrompt = {
        ...existingPrompt,
        title,
        originalPrompt,
        optimizedPrompt,
        snippet: generateSnippet(optimizedPrompt),
        profession,
        style,
        tags,
        version: existingPrompt.version + 1,
        updatedAt: new Date().toISOString(),
      };

      // Replace in store
      const index = vaultStore.findIndex(p => p.id === id);
      vaultStore[index] = updatedPrompt;

      return NextResponse.json({
        success: true,
        message: 'Prompt updated successfully',
        prompt: updatedPrompt,
      });
    }

    // Create new prompt
    const newPrompt = {
      id: generateId(),
      title,
      originalPrompt,
      optimizedPrompt,
      snippet: generateSnippet(optimizedPrompt),
      profession,
      style,
      tags,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to store
    vaultStore.unshift(newPrompt); // Add to beginning (newest first)

    return NextResponse.json({
      success: true,
      message: 'Prompt saved to vault successfully',
      prompt: newPrompt,
    }, { status: 201 });

  } catch (error) {
    console.error('Vault POST error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save prompt',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - REMOVE PROMPT
// ============================================

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Prompt ID is required' },
        { status: 400 }
      );
    }

    const index = vaultStore.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Remove from store
    const deletedPrompt = vaultStore.splice(index, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Prompt deleted successfully',
      deletedPrompt,
    });

  } catch (error) {
    console.error('Vault DELETE error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete prompt',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ============================================
// OPTIONAL: PATCH - UPDATE SPECIFIC FIELDS
// ============================================

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Prompt ID is required' },
        { status: 400 }
      );
    }

    const prompt = findPromptById(id);

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Update only provided fields
    const updatedPrompt = {
      ...prompt,
      ...body,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    // Update snippet if optimizedPrompt changed
    if (body.optimizedPrompt) {
      updatedPrompt.snippet = generateSnippet(body.optimizedPrompt);
    }

    // Replace in store
    const index = vaultStore.findIndex(p => p.id === id);
    vaultStore[index] = updatedPrompt;

    return NextResponse.json({
      success: true,
      message: 'Prompt updated successfully',
      prompt: updatedPrompt,
    });

  } catch (error) {
    console.error('Vault PATCH error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update prompt',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}