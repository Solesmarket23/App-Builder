import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@env';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

/**
 * Generates React Native component code based on user's app idea
 * @param {string} appIdea - User's description of the app they want to build
 * @returns {Promise<{code: string, componentName: string}>} - Generated component code and name
 */
export async function generateAppCode(appIdea) {
  try {
    const prompt = `You are an expert React Native developer. Generate a complete, functional React Native component based on this app idea:

"${appIdea}"

Requirements:
1. Return ONLY the component code, no explanations
2. Use React Native core components (View, Text, ScrollView, TouchableOpacity, TextInput, etc.)
3. Include proper imports from 'react' and 'react-native'
4. Use StyleSheet for styling
5. Make it beautiful with modern UI/UX
6. Include functional features (buttons should work, forms should handle input, etc.)
7. Use hooks (useState, useEffect) for state management
8. Component name should be 'GeneratedApp'
9. Export as default: export default function GeneratedApp()
10. Include sample data if needed (no API calls)
11. Make it interactive and fully functional
12. Use a nice color scheme

Generate the complete component code now:`;

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

    return {
      code: generatedCode,
      componentName: 'GeneratedApp',
    };
  } catch (error) {
    console.error('Error generating app code:', error);
    throw new Error('Failed to generate app. Please try again.');
  }
}

