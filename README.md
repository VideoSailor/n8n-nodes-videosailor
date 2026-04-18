# 🎬 n8n-nodes-videosailor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![npm](https://img.shields.io/npm/v/n8n-nodes-videosailor)

⛵ This is an n8n community node for processing video files using the [VideoSailor](https://videosailor.com) API. It enables you to download, trim, cut, resize, transcribe, and subtitle videos from within your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## ✨ Features

**🎞️ Video Processing Operations**
- ⬇️ Download, ✂️ trim, cut, and 📐 resize videos
- 📊 Get detailed video metadata
- 🎙️ Transcribe audio with word- and segment-level timestamps
- 💬 Burn custom styled subtitles into videos

**🌍 Universal Input Support**
- 🔗 Direct video URLs
- 📱 Social media links — YouTube, TikTok, Instagram, Twitter/X, Vimeo, and 1,000+ sites

**🔌 Easy Integration**
- 🔑 Simple credential setup (API key header auth)
- 🤖 Native n8n integration — `usableAsTool: true`, so the node works as an AI agent tool
- 🎯 Single node with operation dropdown — no per-operation node sprawl

## 📚 Table of Contents

- [Installation](#-installation)
- [Operations](#-operations)
- [Credentials](#-credentials)
- [Compatibility](#-compatibility)
- [Resources](#-resources)
- [Development](#-development)

## 📦 Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## ⚙️ Operations

### 🎥 Video Operations

- ⬇️ **Download** — Download a video from a URL and return the file as n8n binary data
- ℹ️ **Video Info** — Get video metadata (title, duration, thumbnails) without downloading
- ✂️ **Trim** — Trim a video to a start/end time range
- 🔪 **Cut** — Cut a segment from a video (alias for Trim)
- 📐 **Resize** — Resize a video either by explicit width/height or by aspect ratio + resolution preset (HD / Full HD / 2K / 4K / 8K)
- 🎙️ **Transcribe** — Transcribe a video and return timestamped words and segments
- 💬 **Subtitles** — Burn custom subtitles (position, font size, color, stroke, background) into a video
- 📏 **Info** — Get video dimensions and aspect ratio

💡 The node accepts any URL the VideoSailor API supports — direct media URLs and social media URLs (YouTube, TikTok, Instagram, etc.).

## 🔐 Credentials

This node requires API credentials for the VideoSailor API.

### 🗝️ Getting Your API Key

1. 🌐 Visit [VideoSailor](https://videosailor.com) and sign up for an account
2. ⚙️ Navigate to **Settings → API Keys** in the dashboard
3. ✨ Generate a new API key
4. 📋 Copy the API key

📖 Refer to the [API Keys Guide](https://videosailor.com/api-usage?content=keys) for detailed instructions on obtaining and managing your API keys.

### 🛠️ Configuring Credentials in n8n

1. ➕ In n8n, create new credentials
2. 🎯 Select **VideoSailor API** from the credential types
3. 🔑 Enter your API key
4. 🌐 (Optional) Override the **Base URL** — defaults to `https://api.videosailor.com`; set to `http://localhost:8080` for local development
5. 💾 Save the credentials
6. ✅ Use these credentials when configuring the VideoSailor node

## 🧩 Compatibility

✅ Compatible with n8n@1.60.0 or later.

## 🔗 Resources

- 📘 [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- 📗 [VideoSailor API Documentation](https://videosailor.com/api-usage?content=documentation)
- 🔑 [VideoSailor API Keys Guide](https://videosailor.com/api-usage?content=keys)

## 🧑‍💻 Development

### 📋 Prerequisites

- 🟢 Node.js (version compatible with the `typescript` and `n8n-workflow` peer range)
- 📦 npm

### 🚀 Setup

1. 📥 Clone the repository
2. 📦 Install dependencies:
   ```bash
   cd n8n-node
   npm install
   ```

### 🏗️ Building

Build the node package (compiles TypeScript and copies icons via gulp):
```bash
npm run build
```

👀 Watch mode for development:
```bash
npm run dev
```

### 🔗 Linking into a local n8n instance

```bash
npm link
cd ~/.n8n/custom
npm link n8n-nodes-videosailor
```

🔄 Then restart n8n so the custom node is picked up.

### 🧹 Linting & Formatting

🔍 Run ESLint:
```bash
npm run lint
```

🛠️ Fix linting issues automatically:
```bash
npm run lintfix
```

✨ Format sources with Prettier:
```bash
npm run format
```

### 🚢 Publishing

```bash
npm run build
npm publish
```
