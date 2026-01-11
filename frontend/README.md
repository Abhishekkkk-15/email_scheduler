# Email Scheduler - Workflow Automation

Modern email automation workflow builder with visual editor built using Next.js, React Flow, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Workflow Builder**: React Flow
- **Authentication**: NextAuth (Google OAuth)
- **State Management**: Zustand
- **TypeScript**: Full type safety

## Project Structure

```
/app
  /api/auth/[...nextauth]   # NextAuth API routes
  /dashboard                # Main dashboard with workflow list
  /login                    # Google login page
  /workflow/[id]            # Workflow builder page
  layout.tsx                # Root layout with providers
  page.tsx                  # Home redirect logic
  providers.tsx             # SessionProvider + Toaster

/components
  /ui                       # shadcn components
  /workflow
    /nodes                  # Node components
      lead-source-node.tsx
      email-node.tsx
      wait-node.tsx
    /modals                 # Configuration modals
      lead-source-modal.tsx
      email-config-modal.tsx
      wait-config-modal.tsx
    action-bar.tsx          # Top action buttons
    workflow-canvas.tsx     # React Flow canvas

/lib
  auth.ts                   # NextAuth configuration
  workflow-store.ts         # Zustand store

/types
  workflow.ts               # Type definitions
  next-auth.d.ts            # NextAuth types
```

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed. If needed:
```bash
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

### 3. Update Environment Variables

Edit `.env.local`:
```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Authentication
- Google OAuth login only
- Protected routes with middleware
- Session management with NextAuth

### Dashboard
- View all workflows
- Create new workflows
- Quick access to workflow editor

### Workflow Builder
- Visual node-based editor
- Drag and drop nodes
- Connect nodes with edges
- Zoom, pan, and fit view controls

### Node Types

1. **Lead Source Node**
   - Configure lead source (Google, CSV, API, etc.)

2. **Cold Email Node**
   - Sender email
   - Email type (welcome/follow-up)
   - Email body content

3. **Wait Node**
   - Delay duration
   - Time unit (seconds/minutes/hours)

4. **Follow-up Email Node**
   - Same as Cold Email with follow-up context

### Actions
- Add nodes via action bar
- Configure nodes via modals
- Clear workflow
- Save workflow (local state)

## Development Notes

- All data stored in local state (Zustand)
- No backend integration required
- Protected routes use NextAuth middleware
- Responsive design with Tailwind CSS
- Type-safe with TypeScript

## Build for Production

```bash
npm run build
npm start
```

## Key Libraries

- `next-auth`: Authentication
- `zustand`: State management
- `reactflow`: Workflow visualization
- `sonner`: Toast notifications
- `lucide-react`: Icons
