const prompt = `Optimized Result: Reverse Filter Application in CapCut
WHO: Video editor using CapCut.
ACTION: Apply reverse filter to a video clip.
LIMITATION: CapCut mobile app only; no desktop version.
TONE: Informative and step-by-step.
Detailed Steps:
- Import Video: Open CapCut and import the video clip.
- Example: Tap "New Project," select the video from your gallery, and tap "Add."
- Select Clip: Tap the video clip on the timeline to select it.
- Context: Ensure the clip is highlighted to apply edits.
- Find 'Reverse': Scroll through the bottom toolbar to find the "Reverse" option.
- Constraint: The "Reverse" option might take time to process, depending on video length.
- Apply Reverse: Tap "Reverse." Let CapCut process the reversal.
- Expectation: The video will play backward once processed.
- Preview: Preview the reversed clip.
- Example: Tap the play button to watch the reversed clip.
- Further Editing: Edit the video as needed (trim, add effects, etc.).
- Context: Use other tools in CapCut for additional effects or adjustments.
- Export: Export the video.
- Example: Tap the export button (usually at the top right) and choose your desired resolution and frame rate.
[#CapCut, #VideoEditing, #ReverseFilter]`;

const lines = prompt.split("\n");

// Title = first line
const title = lines[0];

// Tags = last line, cleaned into array
const rawTags = lines[lines.length - 1];
const tags = rawTags.match(/#\w+/g)

// Optimized Prompt = everything in between
const optimizedPrompt = lines.slice(1, -1).join("\n");

console.log("Title:", title);
console.log("Optimized Prompt:", optimizedPrompt);
console.log("Tags:", tags);