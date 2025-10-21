import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@env';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

/**
 * Generates React Native component code based on user's app idea
 * @param {string} appIdea - User's description of the app they want to build
 * @returns {Promise<{code: string, componentName: string, usage: object, cost: object}>} - Generated component code, name, token usage, and cost
 */
export async function generateAppCode(appIdea) {
  try {
    const prompt = `You are an expert React Native developer using Expo. Generate a complete, production-ready React Native app based on this idea: "${appIdea}"

CRITICAL REQUIREMENTS:

1. Output ONLY valid React Native code with Expo - no explanations, no markdown, no backticks

2. Start with: import React from 'react';

3. Use ONLY these imports:
   - react
   - react-native (View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator, etc.)
   - @expo/vector-icons (for icons)
   - expo-linear-gradient (for gradients)
   - NO OTHER LIBRARIES

4. Create a complete, working app with:
   - Proper state management using useState and useEffect
   - Have 20,000 UI and UX designers each with 20 years of experience implement a clean and modern UI with good spacing and colors
   - Interactive elements that actually work
   - Sample data where needed (at least 5-10 items)
   - Smooth user experience

5. Use StyleSheet.create() for ALL styling

6. Include proper error handling

7. Make it visually appealing with:
   - Modern color palette
   - Good typography (use different font sizes and weights)
   - Proper spacing and padding
   - Box shadows where appropriate
   - Smooth animations for interactions

8. The app should be immediately runnable in Expo Go

9. Use functional components with hooks only

10. Add comments for complex logic

STRUCTURE:
- Put ALL code in a single component named 'GeneratedApp'
- Export default at the end: export default function GeneratedApp()
- Include realistic sample data
- Make all interactive elements functional

DO NOT:
- Include any explanations before or after the code
- Use markdown code blocks or backticks
- Import libraries that aren't listed above
- Leave placeholder comments like "// Add more features here"
- Create incomplete or non-functional features

The user should be able to copy this code directly into Expo Snack and have it work perfectly.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the code from the response
    let generatedCode = message.content[0].text;

    // Remove markdown code blocks if present
    generatedCode = generatedCode.replace(/```jsx?\n?/g, '').replace(/```\n?$/g, '');

    // Calculate costs (Claude Sonnet 4 pricing as of 2025)
    // Input: $3 per million tokens
    // Output: $15 per million tokens
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const inputCost = (inputTokens / 1000000) * 3;
    const outputCost = (outputTokens / 1000000) * 15;
    const totalCost = inputCost + outputCost;

    return {
      code: generatedCode,
      componentName: 'GeneratedApp',
      usage: {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens,
      },
      cost: {
        input_cost: inputCost,
        output_cost: outputCost,
        total_cost: totalCost,
      },
    };
  } catch (error) {
    console.error('Error generating app code:', error);
    throw new Error('Failed to generate app. Please try again.');
  }
}

