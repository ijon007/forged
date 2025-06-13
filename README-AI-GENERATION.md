# AI Course Generation Setup

This project now includes AI-powered course generation using Gemini 2.0 Flash! 🎉

## Prerequisites

You'll need a Google AI API key to use the course generation feature.

## Setup

1. **Get your Google AI API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key for Gemini
   - Copy the API key

2. **Environment Variables**
   Create a `.env.local` file in your project root and add:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
   ```

3. **Install Dependencies**
   ```bash
   bun install
   ```

## How to Use

1. **Upload PDF**: Click the "Create New Page" button and upload a PDF file (max 10MB)
2. **Add Details**: Provide title, description, and price information (optional)
3. **Generate**: Click "Generate Page" to create AI-powered content
4. **Preview**: View your generated blog post with full markdown support

## Features

- **PDF Text Extraction**: Automatically extracts text from uploaded PDFs
- **AI Content Generation**: Creates engaging blog posts using Gemini 2.0 Flash
- **Structured Output**: Generates title, description, content, tags, and key points
- **Markdown Support**: Full markdown rendering in the preview
- **Real-time Progress**: Shows generation progress with status updates

## Technical Details

- **AI Model**: Gemini 2.0 Flash with structured outputs
- **PDF Processing**: Using `pdf-parse` library
- **Markdown Rendering**: `react-markdown` with `remark-gfm`
- **Toast Notifications**: `sonner` for user feedback
- **Data Storage**: In-memory store (replace with database in production)

## File Structure

```
actions/course-actions.ts     # Server action for AI generation
lib/course-store.ts          # In-memory data store
components/create-course-dialog.tsx  # Upload and generation UI
components/preview/          # Preview components
```

## Production Notes

- Replace the in-memory store with a proper database
- Add user authentication for course ownership
- Implement rate limiting for AI generation
- Add file storage for uploaded PDFs
- Consider caching generated content

## Troubleshooting

- **API Key Issues**: Make sure your Google AI API key is correctly set in `.env.local`
- **PDF Upload Errors**: Check file size (max 10MB) and ensure it's a valid PDF
- **Generation Failures**: Check console logs for detailed error messages 