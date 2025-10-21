# AppBuilder 🚀

AI-powered React Native app generator that lets you build mobile apps in seconds!

## ✨ Features

- **🤖 AI-Powered Generation**: Describe your app idea and AI generates fully functional React Native code
- **⚡ Instant Preview**: See your generated app in 60-90 seconds with live interactive preview
- **🎨 Beautiful UI**: Modern, polished interface with dark/light mode
- **📱 Phone Frame Preview**: View your generated app in a realistic phone mockup
- **💾 Export Ready**: Export your app code for further development or publishing

## 🎯 User Flow

1. **Describe Your Idea**: Enter a description of the app you want to build
2. **AI Generates Code**: Claude AI creates fully functional React Native components
3. **Live Preview**: Interact with your generated app immediately
4. **Export (Optional)**: Download code or prepare for App Store publishing later

## 🛠️ Setup

### Prerequisites

- Node.js (v20.17.0 or higher recommended)
- npm or yarn
- Expo CLI
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Solesmarket23/App-Builder.git
cd App-Builder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
API_URL=http://localhost:3000
```

5. Start the app:
```bash
npm start
```

## 📖 Usage

### Basic Usage

1. Open the app
2. Enter your app idea (e.g., "Todo list with colorful categories")
3. Or select from example ideas
4. Tap "Generate App Now"
5. Wait 60-90 seconds for AI generation
6. Interact with your live preview!

### Export Options

- **Download Code**: Get the generated React Native code
- **Share Link**: Share your app with others (coming soon)
- **Publish to App Store**: Add your Apple Developer credentials later

## 🏗️ Architecture

- **Frontend**: React Native + Expo
- **AI**: Anthropic Claude (Sonnet 4)
- **Dynamic Rendering**: Runtime component evaluation
- **State Management**: React Hooks

### Project Structure

```
AppBuilder/
├── App.js                 # Main app component
├── components/
│   ├── PreviewScreen.js   # Phone frame preview
│   └── LoadingScreen.js   # Generation loading animation
├── services/
│   └── anthropicService.js # AI generation logic
├── assets/                # App icons and images
└── .env                   # Environment variables (not in git)
```

## 🎨 Example Ideas

- Todo list with colorful categories
- Recipe finder with search
- Fitness tracker dashboard
- Weather with 5-day forecast
- Budget expense tracker

## 🚀 Publishing Generated Apps

Generated apps can be published to the Apple App Store:

1. **Via Expo (Easier)**:
   - Build with EAS: `expo build:ios`
   - Submit: `expo submit:ios`
   - Requires Apple Developer account ($99/year)

2. **Via Xcode (More Control)**:
   - Open project in Xcode
   - Configure signing & capabilities
   - Archive and upload to App Store Connect

## 🔒 Security Notes

- API keys are stored in `.env` (not committed to git)
- Generated code uses `new Function()` for dynamic evaluation
- In production, consider sandboxing or server-side generation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

Private project - All rights reserved

## 🙏 Credits

Built with:
- React Native
- Expo
- Anthropic Claude AI
- React Native Linear Gradient

---

Made with ❤️ by Solesmarket23

