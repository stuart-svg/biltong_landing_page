# High Protein Biltong - Customer Support Landing Page

A professional landing page featuring a VAPI voice agent and AI-powered chatbot for customer support.

## Features

- 🎤 **VAPI Voice Agent** - Interactive voice assistant for customer inquiries
- 💬 **AI Chatbot** - GPT-4o powered chat support via OpenRouter
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast & Secure** - Serverless functions on Netlify
- 🎨 **Modern UI** - Clean, professional design with smooth animations

## What It Does

The landing page provides two ways for customers to get support:

1. **Voice Assistant** - Click to speak with an AI voice agent that answers questions about:
   - Health benefits of biltong
   - Available flavours
   - Product information
   - Ordering details

2. **Chat Assistant** - Type messages to chat with an AI bot about the same topics

## Deployment Instructions

### Step 1: Push to GitHub

1. Initialize git repository and push to GitHub:

\`\`\`bash
cd biltong-landing-page
git init
git add .
git commit -m "Initial commit: High Protein Biltong landing page"
\`\`\`

2. Create a new repository on GitHub (don't initialize with README)

3. Push your code:

\`\`\`bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
\`\`\`

### Step 2: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
6. Click **"Deploy site"**

### Step 3: Configure Environment Variables

**CRITICAL:** You must add your OpenRouter API key as an environment variable:

1. In your Netlify site dashboard, go to **"Site settings"** → **"Environment variables"**
2. Click **"Add a variable"**
3. Add the following:
   - **Key:** `OPENROUTER_API_KEY`
   - **Value:** `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`
4. Click **"Save"**
5. Go back to **"Deploys"** and click **"Trigger deploy"** → **"Deploy site"**

### Step 4: Test Your Site

Once deployed, Netlify will give you a URL (e.g., `https://your-site-name.netlify.app`)

Test both features:
- Click **"Start Voice Call"** to test VAPI integration
- Click **"Open Chat"** to test the chatbot

## Local Development

To test locally before deploying:

1. Install Netlify CLI:
\`\`\`bash
npm install -g netlify-cli
\`\`\`

2. Create a `.env` file in the project root:
\`\`\`
OPENROUTER_API_KEY=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
\`\`\`

3. Run local development server:
\`\`\`bash
netlify dev
\`\`\`

4. Open `http://localhost:8888` in your browser

## Project Structure

\`\`\`
biltong-landing-page/
├── public/
│   ├── index.html          # Main landing page
│   ├── styles.css          # Styling
│   └── app.js              # VAPI and chat functionality
├── netlify/
│   └── functions/
│       └── chat.js         # Serverless function for OpenRouter API
├── netlify.toml            # Netlify configuration
├── package.json            # Project metadata
├── .gitignore              # Git ignore rules
└── README.md               # This file
\`\`\`

## Configuration Details

### VAPI Integration

The VAPI voice agent is configured in [app.js](public/app.js) with:
- **Assistant ID:** `d9e21a53-cd34-4fb6-9f24-e0551e264b5f`
- **Public Key:** `b3d3a6a0-a181-4117-8b3d-90e4f632a5a7`

These credentials are directly in the frontend code (public keys are safe to expose).

### OpenRouter/GPT-4o Chatbot

The chatbot uses:
- **Model:** `openai/gpt-4o`
- **API:** OpenRouter (https://openrouter.ai)
- **Backend:** Netlify serverless function at `/.netlify/functions/chat`

The API key is stored securely as an environment variable and never exposed to the frontend.

## Customization

### Change Branding

Edit [index.html](public/index.html):
- Line 7: Change page title
- Line 13: Change company name and emoji
- Line 14: Change tagline

### Change Colors

Edit [styles.css](public/styles.css):
- Lines 1-12: CSS variables for colors

### Change Chatbot Behavior

Edit [app.js](public/app.js):
- Lines 71-84: System prompt that defines chatbot personality and knowledge

### Change AI Model

Edit [netlify/functions/chat.js](netlify/functions/chat.js):
- Line 26: Change `model` value (e.g., `openai/gpt-4o-mini`, `anthropic/claude-3.5-sonnet`)

## Troubleshooting

### Chat isn't working
- Check that environment variable is set in Netlify
- Check browser console for errors
- Verify OpenRouter API key is valid

### Voice agent isn't working
- Check browser console for VAPI errors
- Verify microphone permissions are granted
- Check VAPI dashboard for assistant status

### Deployment failed
- Check build logs in Netlify dashboard
- Ensure all files are committed to git
- Verify netlify.toml configuration

## Support

For issues with:
- **VAPI:** Check [VAPI documentation](https://docs.vapi.ai)
- **OpenRouter:** Check [OpenRouter docs](https://openrouter.ai/docs)
- **Netlify:** Check [Netlify docs](https://docs.netlify.com)

## Security Notes

- ✅ VAPI public key is safe to include in frontend code
- ✅ OpenRouter API key is secured via environment variables
- ✅ Serverless function acts as secure proxy for API calls
- ⚠️ Never commit API keys to git (already in .gitignore)

## License

MIT
