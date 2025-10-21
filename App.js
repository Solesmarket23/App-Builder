import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ExpoVectorIcons from '@expo/vector-icons';
import { generateAppCode } from './services/anthropicService';
import PreviewScreen from './components/PreviewScreen';
import LoadingScreen from './components/LoadingScreen';

const { width } = Dimensions.get('window');

/**
 * AppBuilder - AI-powered app generator
 * Allows users to describe an app idea and generates React Native code with live preview
 */
export default function App() {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [GeneratedComponent, setGeneratedComponent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [usageStats, setUsageStats] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Example ideas to help users get started
  const exampleIdeas = [
    'Todo list with colorful categories',
    'Recipe finder with search',
    'Fitness tracker dashboard',
    'Weather with 5-day forecast',
    'Budget expense tracker',
  ];

  /**
   * Handles the generation of the app based on user input
   */
  const generateApp = async (modificationRequest = null) => {
    const userMessage = modificationRequest || idea;
    
    if (!userMessage.trim()) {
      setError('Please enter an app idea');
      return;
    }

    setIsGenerating(true);
    setError('');
    setShowPreview(false);

    try {
      // Build conversation history for follow-ups
      const isFollowUp = modificationRequest !== null;
      let messages = [];
      
      if (isFollowUp) {
        // Include previous conversation for context
        messages = [...conversationHistory, { role: 'user', content: userMessage }];
      } else {
        // New conversation
        messages = [{ role: 'user', content: userMessage }];
        setConversationHistory([{ role: 'user', content: userMessage }]);
      }

      // Generate React Native code using Anthropic AI
      const { code, usage, cost } = await generateAppCode(userMessage, messages);
      setGeneratedCode(code);
      setUsageStats({ usage, cost });

      // Update conversation history with assistant's response
      if (isFollowUp) {
        setConversationHistory([...messages, { role: 'assistant', content: code }]);
      } else {
        setConversationHistory([...messages, { role: 'assistant', content: code }]);
      }

      // For now, show a simple success message
      // TODO: Implement proper JSX dynamic rendering (requires babel transform)
      const SimplePreview = () => {
        return (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#667eea' }}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 32, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 20 }}>
                ✨ App {isFollowUp ? 'Updated' : 'Generated'}!
              </Text>
              <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 40 }}>
                Your app code has been {isFollowUp ? 'updated with your changes' : 'generated successfully'}.
              </Text>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: 24, width: '100%' }}>
                <Text style={{ fontSize: 16, color: '#1e293b', marginBottom: 12 }}>
                  📦 Generated Component: GeneratedApp
                </Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>
                  📝 Lines of code: {code.split('\n').length}
                </Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>
                  💬 Conversation turns: {Math.floor(conversationHistory.length / 2) + 1}
                </Text>
                <Text style={{ fontSize: 14, color: '#64748b' }}>
                  ⚡ Ready to export and run!
                </Text>
              </View>
            </LinearGradient>
          </SafeAreaView>
        );
      };

      setGeneratedComponent(() => SimplePreview);
      setShowPreview(true);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Toggles between dark and light theme
   */
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  /**
   * Populates the input field with an example idea
   */
  const selectExample = (example) => {
    setIdea(example);
    setError('');
  };

  /**
   * Handles going back from preview to main screen
   */
  const handleBack = () => {
    setShowPreview(false);
  };

  /**
   * Handles exporting the generated app
   */
  const handleExport = () => {
    Alert.alert(
      'Export App',
      'Your app code has been generated! Choose an option:',
      [
        {
          text: 'View Code',
          onPress: () => {
            console.log('Generated Code:\n', generatedCode);
            Alert.alert('Code Generated', `${generatedCode.split('\n').length} lines of code generated. Check console for full code.`);
          },
        },
        {
          text: 'Download (Coming Soon)',
          onPress: () => {
            Alert.alert('Coming Soon', 'Code download feature will be available soon!');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Theme colors
  const colors = {
    background: isDarkMode
      ? ['#020617', '#0f172a', '#020617']
      : ['#f9fafb', '#dbeafe', '#f9fafb'],
    card: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    cardBorder: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 1)',
    text: isDarkMode ? '#ffffff' : '#111827',
    textSecondary: isDarkMode ? '#cbd5e1' : '#4b5563',
    textMuted: isDarkMode ? '#64748b' : '#6b7280',
    inputBg: isDarkMode ? 'rgba(2, 6, 23, 0.5)' : '#ffffff',
    inputBorder: isDarkMode ? '#475569' : '#d1d5db',
    chipBg: isDarkMode ? '#1e293b' : '#f3f4f6',
    chipText: isDarkMode ? '#e2e8f0' : '#1f2937',
  };

  // Show loading screen during generation
  if (isGenerating) {
    return <LoadingScreen isDarkMode={isDarkMode} />;
  }

  // Show preview screen if app was generated
  if (showPreview && GeneratedComponent) {
    return (
      <PreviewScreen
        GeneratedComponent={GeneratedComponent}
        onBack={handleBack}
        onExport={handleExport}
        onModify={(modificationRequest) => generateApp(modificationRequest)}
        isDarkMode={isDarkMode}
        usageStats={usageStats}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient colors={colors.background} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Toggle Button */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeToggle,
              {
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderColor: isDarkMode ? '#475569' : '#d1d5db',
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          {/* Header Section */}
          <View style={styles.header}>
            {/* Badge */}
            <LinearGradient
              colors={['#2563eb', '#06b6d4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>⭐ AI-POWERED APP GENERATION</Text>
            </LinearGradient>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>
              Build iOS Apps
            </Text>
            <Text style={[styles.titleAccent, { color: isDarkMode ? '#60a5fa' : '#2563eb' }]}>
              In Seconds
            </Text>

            {/* Subtitle */}
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Transform your ideas into beautiful, production-ready SwiftUI apps
              with AI
            </Text>
          </View>

          {/* Main Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={['#3b82f6', '#06b6d4']}
                style={styles.cardIcon}
              >
                <Text style={styles.cardIconText}>✨</Text>
              </LinearGradient>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Your Vision
              </Text>
            </View>

            {/* Text Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={idea}
                onChangeText={setIdea}
                placeholder="Describe your dream app..."
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
              />
              <View style={styles.charCounter}>
                <Text style={[styles.charCounterText, { color: colors.textMuted }]}>
                  {idea.length} chars
                </Text>
              </View>
            </View>

            {/* Example Ideas */}
            <View style={styles.examplesSection}>
              <Text style={[styles.examplesLabel, { color: colors.textMuted }]}>
                Quick Start
              </Text>
              <View style={styles.examplesContainer}>
                {exampleIdeas.map((example, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => selectExample(example)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.exampleChip,
                        {
                          backgroundColor: colors.chipBg,
                        },
                      ]}
                    >
                      <Text style={[styles.exampleText, { color: colors.chipText }]}>
                        {example}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              onPress={generateApp}
              disabled={isGenerating || !idea.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2563eb', '#06b6d4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.generateButton,
                  (isGenerating || !idea.trim()) && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.generateButtonText}>⚡</Text>
                <Text style={styles.generateButtonText}>
                  {isGenerating ? 'Generating...' : 'Generate App Now'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Error Message */}
            {error ? (
              <View
                style={[
                  styles.errorContainer,
                  {
                    backgroundColor: isDarkMode
                      ? 'rgba(239, 68, 68, 0.1)'
                      : '#fef2f2',
                    borderColor: isDarkMode
                      ? 'rgba(239, 68, 68, 0.5)'
                      : '#fca5a5',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorText,
                    { color: isDarkMode ? '#fca5a5' : '#dc2626' },
                  ]}
                >
                  {error}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
  },
  themeToggle: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 24 : 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  themeIcon: {
    fontSize: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 40,
  },
  badge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 24,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleAccent: {
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 26,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardIconText: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  textInput: {
    height: 200,
    padding: 20,
    borderWidth: 2,
    borderRadius: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  charCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  charCounterText: {
    fontSize: 12,
  },
  examplesSection: {
    marginBottom: 24,
  },
  examplesLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  examplesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorContainer: {
    marginTop: 24,
    padding: 20,
    borderWidth: 2,
    borderRadius: 16,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
