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
  Platform,
  Alert,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ExpoVectorIcons from '@expo/vector-icons';
const Ionicons = ExpoVectorIcons.Ionicons;
const MaterialIcons = ExpoVectorIcons.MaterialIcons;
const Feather = ExpoVectorIcons.Feather;
import { generateAppCode } from './services/anthropicService';
import { createSnack } from './services/snackService';
import PreviewScreen from './components/PreviewScreen';
import LoadingScreen from './components/LoadingScreen';
import ConversationScreen from './components/ConversationScreen';
import ChatScreen from './components/ChatScreen';

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
  const [isModifying, setIsModifying] = useState(false);
  const [modificationRequest, setModificationRequest] = useState('');
  const [showChatView, setShowChatView] = useState(false);
  const [snackUrl, setSnackUrl] = useState(null);
  const [isCreatingSnack, setIsCreatingSnack] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Example ideas to help users get started
  const exampleIdeas = [
    'Todo list with colorful categories',
    'Recipe finder with search',
    'Fitness tracker dashboard',
    'Weather with 5-day forecast',
    'Budget expense tracker',
  ];

  /**
   * Returns to conversation mode from preview
   */
  const handleReturnToConversation = () => {
    setShowPreview(false);
    setShowChatView(true);
    setIdea(''); // Clear input for new modification
  };

  /**
   * Starts a new app conversation
   */
  const handleStartNew = () => {
    setConversationHistory([]);
    setGeneratedCode(null);
    setGeneratedComponent(null);
    setShowPreview(false);
    setShowChatView(false);
    setIdea('');
    setError('');
  };

  /**
   * Views the preview from chat
   */
  const handleViewPreviewFromChat = () => {
    if (GeneratedComponent) {
      setShowChatView(false);
      setShowPreview(true);
    }
  };

  /**
   * Handles the generation of the app based on user input
   */
  const generateApp = async (modificationReq = null) => {
    const userMessage = modificationReq || idea;
    const isModification = modificationReq !== null;
    
    if (!userMessage.trim()) {
      setError('Please enter an app idea');
      return;
    }

    setIsGenerating(true);
    setError('');
    setShowPreview(false);
    
    // Set modification state and request
    if (isModification) {
      setIsModifying(true);
      setModificationRequest(userMessage);
    } else {
      setIsModifying(false);
    }

    try {
      // Build conversation history for follow-ups
      let messages = [];
      
      if (isModification) {
        // Include previous conversation for context
        messages = [...conversationHistory, { role: 'user', content: userMessage }];
      } else {
        // New conversation
        messages = [{ role: 'user', content: userMessage }];
        setConversationHistory([{ role: 'user', content: userMessage }]);
      }

      // Generate React Native code using Anthropic AI with progress updates
      const { code, usage, cost } = await generateAppCode(
        userMessage, 
        messages,
        (message, thinking) => {
          setProgressMessage(message);
          setIsThinking(thinking);
        }
      );
      setGeneratedCode(code);
      setUsageStats({ usage, cost });

      // Update conversation history with assistant's response
      if (isModification) {
        setConversationHistory([...messages, { role: 'assistant', content: code }]);
      } else {
        setConversationHistory([...messages, { role: 'assistant', content: code }]);
      }

      // Create Snack for live preview in WebView
      setProgressMessage('Preparing your live preview...');
      setIsThinking(true);
      setIsCreatingSnack(true);
      try {
        const appName = `AI Generated: ${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}`;
        const snack = await createSnack(code, appName);
        setSnackUrl(snack.embedUrl);
        console.log('✅ Snack created:', snack.url);
        
        // Create a fallback component (in case WebView doesn't load)
        const SimplePreview = () => {
          return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#667eea' }}>
              <StatusBar barStyle="light-content" />
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 20 }}>
                  App {isModification ? 'Updated' : 'Generated'}!
                </Text>
                <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 40 }}>
                  Loading live preview...
                </Text>
              </LinearGradient>
            </SafeAreaView>
          );
        };
        
        setGeneratedComponent(() => SimplePreview);
      } catch (snackError) {
        console.error('Snack creation failed:', snackError);
        // Fallback if Snack fails
        const SimplePreview = () => {
          return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#667eea' }}>
              <StatusBar barStyle="light-content" />
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 20 }}>
                  App {isModification ? 'Updated' : 'Generated'}!
                </Text>
                <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 40 }}>
                  Your app code has been {isModification ? 'updated with your changes' : 'generated successfully'}.
                </Text>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: 24, width: '100%' }}>
                  <Text style={{ fontSize: 16, color: '#1e293b', marginBottom: 12 }}>
                    Generated Component: GeneratedApp
                  </Text>
                  <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>
                    Lines of code: {code.split('\n').length}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#64748b' }}>
                    Ready to export and run!
                  </Text>
                </View>
              </LinearGradient>
            </SafeAreaView>
          );
        };
        
        setGeneratedComponent(() => SimplePreview);
        setSnackUrl(null);
      } finally {
        setIsCreatingSnack(false);
      }
      
      setIsModifying(false);
      setShowPreview(true);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Generation failed. Please try again.');
      setIsModifying(false);
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

  // Show conversation screen during modification
  if (isGenerating && isModifying) {
    return <ConversationScreen isDarkMode={isDarkMode} userRequest={modificationRequest} />;
  }

  // Show loading screen during initial generation
  if (isGenerating) {
    return (
      <LoadingScreen 
        isDarkMode={isDarkMode} 
        userMessage={idea}
        progressMessage={progressMessage}
        isThinking={isThinking}
      />
    );
  }

  // Show chat view when user returns from preview or has conversation history
  if (showChatView || (conversationHistory.length > 0 && !showPreview)) {
    return (
      <ChatScreen
        conversationHistory={conversationHistory}
        onSendMessage={generateApp}
        onViewPreview={handleViewPreviewFromChat}
        onStartNew={handleStartNew}
        isDarkMode={isDarkMode}
        hasGeneratedApp={!!GeneratedComponent}
      />
    );
  }

  // Show preview screen if app was generated
  if (showPreview && GeneratedComponent) {
    return (
      <PreviewScreen
        GeneratedComponent={GeneratedComponent}
        onBack={handleStartNew}
        onExport={handleExport}
        onReturnToConversation={handleReturnToConversation}
        isDarkMode={isDarkMode}
        usageStats={usageStats}
        snackUrl={snackUrl}
        isCreatingSnack={isCreatingSnack}
        generatedCode={generatedCode}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
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
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={20} 
              color={isDarkMode ? '#fbbf24' : '#6366f1'} 
            />
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
              <MaterialIcons name="auto-awesome" size={14} color="#ffffff" />
              <Text style={styles.badgeText}>AI-POWERED APP GENERATION</Text>
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

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <View style={[styles.conversationContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.conversationHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="chatbubbles" size={16} color={colors.text} style={{ marginRight: 6 }} />
                  <Text style={[styles.conversationTitle, { color: colors.text }]}>
                    Conversation History
                  </Text>
                </View>
                <Text style={[styles.conversationCount, { color: colors.textMuted }]}>
                  {Math.floor(conversationHistory.length / 2) + 1} {Math.floor(conversationHistory.length / 2) + 1 === 1 ? 'iteration' : 'iterations'}
                </Text>
              </View>
              <ScrollView style={styles.conversationScroll} showsVerticalScrollIndicator={false}>
                {conversationHistory.map((msg, index) => (
                  msg.role === 'user' && (
                    <View key={index} style={styles.conversationMessage}>
                      <View style={styles.messageHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Feather name="user" size={12} color="#6366f1" style={{ marginRight: 4 }} />
                          <Text style={styles.messageRole}>You</Text>
                        </View>
                        <Text style={[styles.messageIndex, { color: colors.textMuted }]}>
                          #{Math.floor(index / 2) + 1}
                        </Text>
                      </View>
                      <Text style={[styles.messageText, { color: colors.text }]} numberOfLines={2}>
                        {msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}
                      </Text>
                    </View>
                  )
                ))}
              </ScrollView>
            </View>
          )}

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
                <Ionicons name="bulb" size={20} color="#ffffff" />
              </LinearGradient>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {conversationHistory.length > 0 ? 'Modify Your App' : 'Your Vision'}
              </Text>
            </View>

            {/* Text Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={idea}
                onChangeText={setIdea}
                placeholder={conversationHistory.length > 0 ? "What would you like to change?" : "Describe your dream app..."}
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
              onPress={() => generateApp()}
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
                <Ionicons 
                  name={conversationHistory.length > 0 ? "refresh" : "flash"} 
                  size={20} 
                  color="#ffffff" 
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.generateButtonText}>
                  {isGenerating 
                    ? (conversationHistory.length > 0 ? 'Updating...' : 'Generating...') 
                    : (conversationHistory.length > 0 ? 'Update App' : 'Generate App Now')
                  }
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
    </SafeAreaProvider>
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
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  conversationContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: 200,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 116, 139, 0.2)',
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  conversationCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  conversationScroll: {
    maxHeight: 120,
  },
  conversationMessage: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
  },
  messageIndex: {
    fontSize: 11,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
