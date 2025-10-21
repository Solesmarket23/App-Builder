import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@env';

// Set to true to use mock data instead of real API calls (for testing)
const USE_MOCK_MODE = false;

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

/**
 * Mock API response for testing without using API credits
 * @param {string} appIdea - User's app idea
 * @returns {Promise<Object>} - Mock response matching Anthropic API format
 */
async function getMockResponse(appIdea) {
  // Simulate API delay (15-18 seconds to match loading animation)
  await new Promise(resolve => setTimeout(resolve, 15000 + Math.random() * 3000));

  // Using string concatenation to avoid template literal issues
  const mockCode = 
"import React, { useState } from 'react';\n" +
"import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';\n" +
"import { LinearGradient } from 'expo-linear-gradient';\n" +
"import { Ionicons } from '@expo/vector-icons';\n" +
"\n" +
"export default function GeneratedApp() {\n" +
"  const [count, setCount] = useState(0);\n" +
"  const [items, setItems] = useState([\n" +
"    { id: 1, title: 'Task 1', completed: false },\n" +
"    { id: 2, title: 'Task 2', completed: false },\n" +
"    { id: 3, title: 'Task 3', completed: true },\n" +
"    { id: 4, title: 'Task 4', completed: false },\n" +
"    { id: 5, title: 'Task 5', completed: true },\n" +
"  ]);\n" +
"\n" +
"  const toggleItem = (id) => {\n" +
"    setItems(items.map(item => \n" +
"      item.id === id ? { ...item, completed: !item.completed } : item\n" +
"    ));\n" +
"  };\n" +
"\n" +
"  return (\n" +
"    <SafeAreaView style={styles.container}>\n" +
"      <StatusBar barStyle=\"light-content\" />\n" +
"      <LinearGradient\n" +
"        colors={['#667eea', '#764ba2']}\n" +
"        style={styles.gradient}\n" +
"      >\n" +
"        <View style={styles.header}>\n" +
"          <Text style={styles.headerTitle}>Mock Preview</Text>\n" +
"          <Text style={styles.headerSubtitle}>Demo App</Text>\n" +
"        </View>\n" +
"\n" +
"        <View style={styles.card}>\n" +
"          <Text style={styles.cardTitle}>Counter Demo</Text>\n" +
"          <Text style={styles.counterText}>{count}</Text>\n" +
"          <View style={styles.buttonRow}>\n" +
"            <TouchableOpacity \n" +
"              style={styles.button}\n" +
"              onPress={() => setCount(count - 1)}\n" +
"            >\n" +
"              <Ionicons name=\"remove\" size={24} color=\"#fff\" />\n" +
"            </TouchableOpacity>\n" +
"            <TouchableOpacity \n" +
"              style={styles.button}\n" +
"              onPress={() => setCount(count + 1)}\n" +
"            >\n" +
"              <Ionicons name=\"add\" size={24} color=\"#fff\" />\n" +
"            </TouchableOpacity>\n" +
"          </View>\n" +
"        </View>\n" +
"\n" +
"        <ScrollView style={styles.scrollView}>\n" +
"          <View style={styles.card}>\n" +
"            <Text style={styles.cardTitle}>Task List Demo</Text>\n" +
"            {items.map(item => (\n" +
"              <TouchableOpacity\n" +
"                key={item.id}\n" +
"                style={styles.item}\n" +
"                onPress={() => toggleItem(item.id)}\n" +
"              >\n" +
"                <Ionicons \n" +
"                  name={item.completed ? \"checkmark-circle\" : \"ellipse-outline\"}\n" +
"                  size={24}\n" +
"                  color={item.completed ? \"#4ade80\" : \"#94a3b8\"}\n" +
"                />\n" +
"                <Text style={[\n" +
"                  styles.itemText,\n" +
"                  item.completed && styles.itemTextCompleted\n" +
"                ]}>\n" +
"                  {item.title}\n" +
"                </Text>\n" +
"              </TouchableOpacity>\n" +
"            ))}\n" +
"          </View>\n" +
"        </ScrollView>\n" +
"      </LinearGradient>\n" +
"    </SafeAreaView>\n" +
"  );\n" +
"}\n" +
"\n" +
"const styles = StyleSheet.create({\n" +
"  container: { flex: 1, backgroundColor: '#667eea' },\n" +
"  gradient: { flex: 1, padding: 20 },\n" +
"  header: { marginBottom: 24 },\n" +
"  headerTitle: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 4 },\n" +
"  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' },\n" +
"  card: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },\n" +
"  cardTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 16 },\n" +
"  counterText: { fontSize: 64, fontWeight: '900', color: '#667eea', textAlign: 'center', marginVertical: 20 },\n" +
"  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },\n" +
"  button: { backgroundColor: '#667eea', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },\n" +
"  scrollView: { flex: 1 },\n" +
"  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },\n" +
"  itemText: { fontSize: 16, color: '#1e293b', marginLeft: 12, flex: 1 },\n" +
"  itemTextCompleted: { textDecorationLine: 'line-through', color: '#94a3b8' },\n" +
"});";

  return {
    content: [
      {
        text: mockCode,
      },
    ],
    usage: {
      input_tokens: 450,
      output_tokens: 1250,
    },
  };
}

/**
 * Validates generated code for common errors
 * @param {string} code - Generated React Native code
 * @returns {Array<{type: string, message: string}>} - Array of errors found
 */
function validateCode(code) {
  const errors = [];

  // Critical errors (must fix)
  if (!code.includes('SafeAreaView')) {
    errors.push({ type: 'CRITICAL', message: 'Missing SafeAreaView wrapper' });
  }

  if (code.includes('FlatList') && !code.includes('keyExtractor')) {
    errors.push({ type: 'CRITICAL', message: 'FlatList missing keyExtractor' });
  }

  if (code.includes('AsyncStorage')) {
    errors.push({ type: 'CRITICAL', message: 'Using unavailable AsyncStorage' });
  }

  if (code.includes('react-native-vector-icons')) {
    errors.push({ type: 'CRITICAL', message: 'Using wrong icon library (should use @expo/vector-icons)' });
  }

  if (code.includes('require(') && code.includes('.png')) {
    errors.push({ type: 'CRITICAL', message: 'Using require() for images (use URI instead)' });
  }

  // Check for forbidden Expo packages
  const forbiddenPackages = [
    'expo-notifications',
    'expo-av', 
    'expo-camera',
    'expo-location',
    'expo-file-system',
    'expo-media-library',
    'expo-contacts',
    'expo-calendar',
    'react-native-maps'
  ];

  forbiddenPackages.forEach(pkg => {
    if (code.includes(`from '${pkg}'`) || code.includes(`from "${pkg}"`)) {
      errors.push({ type: 'CRITICAL', message: `Using unavailable package: ${pkg} (not available in Snack)` });
    }
  });

  // Warning errors (nice to fix)
  if (!code.includes('StatusBar')) {
    errors.push({ type: 'WARNING', message: 'Missing StatusBar component' });
  }

  if (code.includes('.map(') && code.includes('return (') && code.includes('<')) {
    errors.push({ type: 'WARNING', message: 'Using .map() for rendering (consider FlatList for better performance)' });
  }

  return errors;
}

/**
 * Ensures code has perfect syntax by doing a final cleanup pass
 * @param {string} code - Generated code
 * @returns {Promise<string>} - Syntax-perfect code
 */
async function ensurePerfectSyntax(code) {
  const syntaxPrompt = `Review this React Native code and fix ANY syntax errors (missing semicolons, commas, brackets, etc.). 
Return ONLY the corrected code with PERFECT syntax - no explanations, no markdown, no backticks.

CRITICAL: Every statement MUST end with a semicolon. Every array/object MUST have proper commas. All brackets must be balanced.

CODE TO FIX:
${code}

Return the complete code with perfect syntax:`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: syntaxPrompt,
        },
      ],
    });

    let fixedCode = message.content[0].text;
    fixedCode = fixedCode.replace(/```jsx?\n?/g, '').replace(/```\n?$/g, '');
    
    return fixedCode;
  } catch (error) {
    console.error('Error ensuring syntax:', error);
    return code; // Return original if fix fails
  }
}

/**
 * Attempts to auto-fix critical errors in generated code
 * @param {string} code - Generated code with errors
 * @param {Array} errors - List of errors to fix
 * @returns {Promise<string>} - Fixed code
 */
async function fixErrors(code, errors) {
  const errorMessages = errors.map(e => `${e.type}: ${e.message}`).join('\n');
  
  const fixPrompt = `Fix these errors in the React Native code. Return ONLY the corrected code with no explanations:

ERRORS TO FIX:
${errorMessages}

ORIGINAL CODE:
${code}

Return the complete fixed code:`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: fixPrompt,
        },
      ],
    });

    let fixedCode = message.content[0].text;
    fixedCode = fixedCode.replace(/```jsx?\n?/g, '').replace(/```\n?$/g, '');
    
    return fixedCode;
  } catch (error) {
    console.error('Error fixing code:', error);
    return code; // Return original if fix fails
  }
}

/**
 * Generates React Native component code based on user's app idea
 * Supports multi-turn conversations for iterative refinement
 * @param {string} appIdea - User's description of the app or modification request
 * @param {Array} conversationHistory - Array of {role: 'user'|'assistant', content: string} messages
 * @param {Function} onProgress - Callback for progress updates: (message, isThinking) => void
 * @returns {Promise<{code: string, componentName: string, usage: object, cost: object}>} - Generated component code, name, token usage, and cost
 */
export async function generateAppCode(appIdea, conversationHistory = [], onProgress = null) {
  try {
    const isFollowUp = conversationHistory.length > 1;
    
    // Build the prompt - different for initial vs follow-up
    let prompt;
    
    if (isFollowUp) {
      // For follow-ups, provide context and modification request
      const previousCode = conversationHistory.find(msg => msg.role === 'assistant')?.content || '';
      prompt = `You are an expert React Native developer using Expo. The user wants to modify an existing app.

PREVIOUS APP CODE:
${previousCode}

USER'S MODIFICATION REQUEST: "${appIdea}"

Update the app code to incorporate this change. Output ONLY valid React Native code - no explanations, no markdown, no backticks.

CRITICAL REQUIREMENTS:
1. Maintain all the existing functionality unless explicitly asked to change it
2. Apply the requested modification cleanly
3. Keep the same code structure and style
4. ALWAYS import SafeAreaView from 'react-native-safe-area-context' (NOT react-native)
5. Use ONLY these imports: react, react-native (View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator, StatusBar), react-native-safe-area-context (SafeAreaView), @expo/vector-icons, expo-linear-gradient
6. Output the complete updated component code
7. Follow iOS Human Interface Guidelines (generous spacing, 44pt touch targets, iOS colors)

NEVER USE: SafeAreaView from react-native, AsyncStorage, react-native-vector-icons, fetch() calls, require() for images

Return ONLY the complete React Native component code.`;
    } else {
      // Original prompt for initial generation
      prompt = `You are an expert React Native developer using Expo. Generate a complete, production-ready React Native app based on this idea: "${appIdea}"

CRITICAL REQUIREMENTS:

**SYNTAX IS CRITICAL - ALL CODE MUST BE SYNTACTICALLY PERFECT WITH NO ERRORS**

1. Output ONLY valid React Native code with Expo - no explanations, no markdown, no backticks

2. **EVERY statement must end with proper punctuation (semicolons, commas, brackets)**

3. Start with: import React from 'react';

3. Use ONLY these imports (NOTHING ELSE):
   - react
   - react-native (View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator, StatusBar, Dimensions)
   - react-native-safe-area-context (SafeAreaView - REQUIRED for safe areas)
   - @expo/vector-icons (Ionicons, MaterialIcons, Feather, etc. for icons)
   - expo-linear-gradient (LinearGradient for gradients)
   
   **ABSOLUTELY NO OTHER PACKAGES - These are the ONLY 5 imports allowed**

4. Create a complete, working app with:
   - Proper state management using useState and useEffect
   - Clean, modern UI optimized for iOS following Apple's Human Interface Guidelines
   - Interactive elements that actually work
   - Sample data where needed (at least 5-10 items)
   - Smooth, delightful user experience

5. Use StyleSheet.create() for ALL styling

6. Include proper error handling

7. iOS Human Interface Guidelines (CRITICAL):
   - Use generous spacing (minimum 16px padding)
   - Touch targets minimum 44x44 points
   - Use SF Symbols-style icons from @expo/vector-icons
   - Implement subtle animations for interactions
   - Use iOS-native colors (blues, greens from iOS palette)
   - Clear visual hierarchy with proper font sizes
   - Rounded corners (12-16px borderRadius)
   - Shadows for depth (iOS-style subtle shadows)
   - Use double quotes for all strings (no apostrophes in single quotes)

8. The app should be immediately runnable in Expo Go

9. Use functional components with hooks only

10. Add comments for complex logic

ERROR PREVENTION (CRITICAL):
1. ALWAYS import SafeAreaView from 'react-native-safe-area-context' (NOT from 'react-native')
2. ALWAYS wrap the main content in <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
3. ALWAYS add StatusBar component at the top
4. If using FlatList, ALWAYS include keyExtractor={(item) => item.id.toString()}
5. If using TextInput, ALWAYS add both value={state} and onChangeText={setState}
6. NEVER use .map() for lists - use FlatList instead for better performance
7. If using Image, use placeholder URLs: { uri: 'https://via.placeholder.com/150' }
8. ALWAYS check if variables exist before accessing: if (data && data.length > 0)
9. For division, prevent zero: const result = a / (b || 1)
10. If using Modal, include visible={visible} and onRequestClose={() => setVisible(false)}
11. Container View must have flex: 1 or content won't show
12. Use double quotes consistently (avoid apostrophes in single-quoted strings)

NEVER USE (WILL CAUSE ERRORS):
- SafeAreaView from 'react-native' (use react-native-safe-area-context instead)
- AsyncStorage (not available in Snack)
- react-native-vector-icons (use @expo/vector-icons instead)
- fetch() calls to external APIs
- expo-camera, expo-location, expo-file-system (not in web preview)
- expo-notifications (not available in Snack)
- expo-av (not available in Snack)
- expo-media-library, expo-contacts, expo-calendar (not available in Snack)
- react-native-maps (not available in Snack)
- Any push notifications, camera, or device-specific features
- require() for local images (use URLs instead)
- Any library not explicitly listed in allowed imports

COMMON CRASH PREVENTIONS:
\`\`\`javascript
// Correct SafeAreaView import
import { SafeAreaView } from 'react-native-safe-area-context';

// Safe array access
const items = data || [];
if (items && items.length > 0) { /* use items */ }

// Safe object access
const name = user?.name || "Unknown";

// Safe division
const average = total / (count || 1);

// Safe TextInput binding
const [text, setText] = useState("");
<TextInput value={text} onChangeText={setText} />

// Safe FlatList
<FlatList
  data={items || []}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <View>...</View>}
/>

// Correct SafeAreaView usage
<SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
  <StatusBar barStyle="dark-content" />
  {/* Your content */}
</SafeAreaView>
\`\`\`

MANDATORY CHECKLIST (Verify before outputting):
✓ ALL syntax is valid JavaScript (no missing semicolons, commas, or brackets)
✓ SafeAreaView imported from 'react-native-safe-area-context' (NOT react-native)
✓ SafeAreaView wraps all content with edges prop
✓ StatusBar is included
✓ All TextInputs have value AND onChangeText
✓ FlatList has keyExtractor
✓ No .map() used for rendering lists (only FlatList)
✓ Container has flex: 1
✓ No AsyncStorage or banned imports
✓ All state variables are initialized
✓ No undefined property access without checks
✓ iOS HIG spacing (min 16px padding, 44pt touch targets)
✓ Double quotes used consistently
✓ Code passes ESLint validation (proper semicolons, commas, brackets)

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
    }

    let message;

    // Progress: Analyzing request
    if (onProgress) onProgress('Analyzing your idea...', true);

    // Use mock mode if enabled (for testing without API credits)
    if (USE_MOCK_MODE) {
      console.log(`🧪 MOCK MODE: ${isFollowUp ? 'Modifying' : 'Generating'} app (test data)`);
      message = await getMockResponse(appIdea);
    } else {
      // Progress: Calling AI
      if (onProgress) onProgress('Connecting to AI...', true);
      
      // Split prompt into system instructions (cacheable) and user request (not cacheable)
      const systemInstructions = prompt.split('based on this idea:')[0] + 'based on user\'s app idea below.';
      const userRequest = `App idea: "${appIdea}"`;
      
      // Real API call - using Sonnet 4.5 (smartest model)
      message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: [
          {
            type: 'text',
            text: systemInstructions,
            cache_control: { type: 'ephemeral' }, // Cache the system instructions (not the user's idea)
          },
        ],
        messages: [
          {
            role: 'user',
            content: userRequest, // User's unique request - NOT cached
          },
        ],
      });
      
      // Progress: Code received
      if (onProgress) onProgress('Got it! Building your app...', false);
    }

    // Extract the code from the response
    let generatedCode = message.content[0].text;

    // Remove markdown code blocks if present
    generatedCode = generatedCode.replace(/```jsx?\n?/g, '').replace(/```\n?$/g, '');

    // Progress: Validating
    if (onProgress) onProgress('Checking for issues...', true);

    // Validate the generated code
    const errors = validateCode(generatedCode);
    const criticalErrors = errors.filter(e => e.type === 'CRITICAL');

    // If critical errors found, attempt to fix them
    if (criticalErrors.length > 0) {
      if (onProgress) onProgress('Fixing issues...', true);
      
      console.log('Critical errors found, attempting to fix:', criticalErrors);
      generatedCode = await fixErrors(generatedCode, criticalErrors);
      
      // Validate again after fix
      const remainingErrors = validateCode(generatedCode);
      const remainingCritical = remainingErrors.filter(e => e.type === 'CRITICAL');
      
      if (remainingCritical.length > 0) {
        console.warn('Some critical errors remain after fix:', remainingCritical);
      }
    }

    // Log warnings (non-blocking)
    const warnings = errors.filter(e => e.type === 'WARNING');
    if (warnings.length > 0) {
      console.log('Code warnings:', warnings);
    }

    // FINAL PASS: Ensure perfect syntax
    if (onProgress) onProgress('Adding the finishing touches...', true);
    
    console.log('🔍 Running final syntax validation pass...');
    generatedCode = await ensurePerfectSyntax(generatedCode);
    console.log('✅ Syntax validation complete');
    
    // Progress: Complete
    if (onProgress) onProgress('Your app is ready!', false);

    // Calculate costs (Claude Sonnet 4.5 pricing with prompt caching)
    // Standard: $3 input / $15 output per million tokens
    // Cache write: $3.75 per million tokens (1.25x)
    // Cache hit: $0.30 per million tokens (0.1x - 90% savings!)
    const inputTokens = message.usage.input_tokens || 0;
    const outputTokens = message.usage.output_tokens || 0;
    const cacheCreationTokens = message.usage.cache_creation_input_tokens || 0;
    const cacheReadTokens = message.usage.cache_read_input_tokens || 0;
    
    // Calculate costs for each type
    const standardInputCost = (inputTokens / 1000000) * 3;
    const cacheWriteCost = (cacheCreationTokens / 1000000) * 3.75;
    const cacheReadCost = (cacheReadTokens / 1000000) * 0.30;
    const outputCost = (outputTokens / 1000000) * 15;
    
    const totalInputCost = standardInputCost + cacheWriteCost + cacheReadCost;
    const totalCost = totalInputCost + outputCost;
    
    // Log cache performance
    if (cacheReadTokens > 0) {
      const savings = (cacheReadTokens / 1000000) * (3 - 0.30);
      console.log(`💰 Cache hit! Saved $${savings.toFixed(4)} on ${cacheReadTokens} cached tokens`);
    }
    if (cacheCreationTokens > 0) {
      console.log(`📦 Created cache with ${cacheCreationTokens} tokens (valid for 5 minutes)`);
    }

    return {
      code: generatedCode,
      componentName: 'GeneratedApp',
      usage: {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens + cacheCreationTokens + cacheReadTokens,
        cache_creation_tokens: cacheCreationTokens,
        cache_read_tokens: cacheReadTokens,
      },
      cost: {
        input_cost: totalInputCost,
        output_cost: outputCost,
        total_cost: totalCost,
        cache_savings: cacheReadTokens > 0 ? (cacheReadTokens / 1000000) * (3 - 0.30) : 0,
      },
    };
  } catch (error) {
    console.error('Error generating app code:', error);
    throw new Error('Failed to generate app. Please try again.');
  }
}

