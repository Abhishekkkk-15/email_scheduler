# Quick Start Guide

## Setup (5 minutes)

### 1. Configure Google OAuth

**Get credentials:**
```
1. Visit: https://console.cloud.google.com
2. Create/select project
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Add redirect URI: http://localhost:3000/api/auth/callback/google
6. Copy Client ID and Secret
```

### 2. Update `.env.local`

```bash
# Generate secret
openssl rand -base64 32

# Then update .env.local with:
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

### 3. Run Application

```bash
npm run dev
```

Open http://localhost:3000

---

## Using the App

### Login
1. Click "Continue with Google"
2. Authorize with Google account
3. Redirected to Dashboard

### Create Workflow
1. Click "Create New Workflow"
2. Opens empty workflow canvas

### Add Nodes
Use action bar buttons:
- **Add Lead Source** → Configure source (e.g., "Google Ads")
- **Add Cold Email** → Set sender, type, body
- **Add Wait** → Set delay (e.g., 2 hours)
- **Add Follow-up** → Another email node

### Connect Nodes
- Drag from bottom handle (●) of one node
- Connect to top handle of next node
- Creates workflow path

### Configure Nodes
- Click any node
- Modal opens with fields
- Fill in details
- Click "Save"

### Workflow Actions
- **Clear** → Remove all nodes
- **Save** → Save to local state

---

## Example Workflow

```
Lead Source (Google Ads)
    ↓
Cold Email (Welcome)
    ↓
Wait (2 hours)
    ↓
Follow-up Email (Check-in)
```

**Steps:**
1. Add Lead Source → Configure: "Google Ads Campaign"
2. Add Cold Email → Configure sender + welcome message
3. Add Wait → Configure: 2 hours
4. Add Follow-up → Configure sender + check-in message
5. Connect: Lead → Cold → Wait → Follow-up
6. Save workflow

---

## Keyboard & Navigation

**Canvas:**
- Scroll/Pinch → Zoom
- Drag → Pan
- Click node → Configure
- Drag node → Reposition

**Controls:**
- Zoom In/Out buttons
- Fit View button
- Mini-map navigation

---

## Troubleshooting

**Can't login:**
- Check Google OAuth redirect URI matches exactly
- Verify credentials in `.env.local`
- Restart dev server

**Nodes not updating:**
- Click "Save" in modal after editing
- Check browser console for errors

**Canvas not visible:**
- Ensure React Flow CSS is loaded
- Check browser console

---

## Tips

1. **Start Simple:** Begin with Lead → Email flow
2. **Test Connections:** Connect nodes before configuring
3. **Save Often:** Use Save button to persist state
4. **Use Wait Nodes:** Add delays between emails
5. **Clear Canvas:** Use Clear button to start fresh

---

## Demo Workflow

Want to see an example? Add this to `app/workflow/[id]/page.tsx`:

```tsx
import { demoNodes, demoEdges } from '@/lib/demo-data';

// In component:
useEffect(() => {
  if (nodes.length === 0) {
    setNodes(demoNodes);
    setEdges(demoEdges);
  }
}, []);
```

This loads a pre-configured welcome series on first visit.
