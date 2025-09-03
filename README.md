# Inseyab Doc - Document Processing App

A modern document processing application built with React, TypeScript, and Supabase.

## Features

- **OCR Conversion**: Convert images to text and export as DOCX/PDF
- **Document Generation**: Generate documents from prompts using AI
- **User Authentication**: Secure email/password authentication
- **Document Records**: Track and manage your document history
- **Admin Panel**: Administrative features for user management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Quick Start

### Prerequisites

- Node.js 18+ 
- A Supabase project

### Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Supabase**:
   - Create a `.env` file in the project root
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

## Deployment

### Netlify Deployment

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy**

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Upload the `dist` folder** to your hosting provider

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |

## Database Schema

The app uses the following Supabase tables:

- **documents**: Stores document processing records
- **users**: Managed by Supabase Auth

## Test Account

For testing purposes, you can use:
- **Email**: `test@inseyab.com`
- **Password**: `test123`

Or click "Use Test Account" on the login page.

## Admin Access

Admin features are available for the email: `khhorem.khan@raqmiyat.com`

## Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth)
├── lib/           # Utilities and configurations
├── pages/         # Page components
└── main.tsx       # App entry point

supabase/
└── functions/     # Edge functions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Authentication Issues

1. **Check environment variables** in browser console
2. **Verify Supabase credentials** are correct
3. **Check email confirmation settings** in Supabase Auth settings

### Build Issues

1. **Clear node_modules** and reinstall: `rm -rf node_modules && npm install`
2. **Check TypeScript errors**: `npm run lint`

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly