import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

/**
 * ChatScreen - iMessage-style conversation interface
 * @param {Object} props
 * @param {Array} props.conversationHistory - Array of {role, content} messages
 * @param {Function} props.onSendMessage - Callback when user sends a message
 * @param {Function} props.onViewPreview - Callback to view the generated app
 * @param {Function} props.onStartNew - Callback to start a new app
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {boolean} props.hasGeneratedApp - Whether an app has been generated
 */
export default function ChatScreen({
  conversationHistory,
  onSendMessage,
  onViewPreview,
  onStartNew,
  isDarkMode,
  hasGeneratedApp,
}) {
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef(null);

  const colors = {
    background: isDarkMode ? '#000000' : '#ffffff',
    userBubble: ['#667eea', '#764ba2'], // Your brand gradient
    userBubbleSolid: '#667eea',
    assistantBubble: isDarkMode ? '#2c2c2e' : '#e5e5ea',
    userText: '#ffffff',
    assistantText: isDarkMode ? '#ffffff' : '#000000',
    text: isDarkMode ? '#ffffff' : '#000000',
    inputBg: isDarkMode ? '#1c1c1e' : '#f2f2f7',
    inputText: isDarkMode ? '#ffffff' : '#000000',
    sendButton: ['#2563eb', '#06b6d4'], // Your brand blue gradient
    sendButtonSolid: '#2563eb',
    headerBg: isDarkMode ? '#1c1c1e' : '#f9f9f9',
    aiAvatarGradient: ['#667eea', '#764ba2'], // Purple gradient for AI avatar
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversationHistory]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const MessageBubble = ({ message, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const isUser = message.role === 'user';
    const isCode = message.role === 'assistant';

    return (
      <Animated.View
        style={[
          styles.messageBubbleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: isUser ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        {isUser ? (
          <LinearGradient
            colors={colors.userBubble}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.messageBubble,
              {
                borderTopRightRadius: 4,
                borderTopLeftRadius: 18,
                maxWidth: isCode ? '85%' : '75%',
              },
            ]}
          >
            <Text style={[styles.messageText, { color: colors.userText }]}>
              {message.content}
            </Text>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: colors.assistantBubble,
                borderTopRightRadius: 18,
                borderTopLeftRadius: 4,
                maxWidth: isCode ? '85%' : '75%',
              },
            ]}
          >
            {isCode ? (
              <View>
                <View style={styles.aiHeader}>
                  <MaterialIcons name="auto-awesome" size={14} color={colors.assistantText} />
                  <Text style={[styles.aiLabel, { color: colors.assistantText, opacity: 0.7 }]}>
                    AI Generated Code
                  </Text>
                </View>
                <Text style={[styles.codePreview, { color: colors.assistantText, opacity: 0.8 }]}>
                  {message.content.split('\n').length} lines of React Native code
                </Text>
                <Text style={[styles.codeHint, { color: colors.assistantText, opacity: 0.6 }]}>
                  Tap 'View Preview' to see your app
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.messageText,
                  { color: colors.assistantText },
                ]}
              >
                {message.content}
              </Text>
            )}
          </View>
        )}
        <Text style={[styles.timestamp, { color: colors.text, opacity: 0.5 }]}>
          {isUser ? 'You' : 'AI Assistant'}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={colors.aiAvatarGradient}
            style={styles.aiAvatar}
          >
            <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: colors.text, opacity: 0.6 }]}>
              {conversationHistory.length === 0 ? 'Start a conversation' : `${Math.floor(conversationHistory.length / 2) + 1} messages`}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {hasGeneratedApp && (
            <TouchableOpacity onPress={onViewPreview} style={styles.previewButton}>
              <LinearGradient
                colors={colors.userBubble}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.previewButtonGradient}
              >
                <Ionicons name="phone-portrait" size={16} color="#ffffff" />
                <Text style={styles.previewButtonText}>Preview</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onStartNew} style={styles.newButton}>
            <Ionicons name="add-circle" size={28} color={colors.userBubbleSolid} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {conversationHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={colors.aiAvatarGradient}
              style={styles.emptyIconContainer}
            >
              <MaterialIcons name="auto-awesome" size={48} color="#ffffff" />
            </LinearGradient>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Start Building Your App
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text, opacity: 0.6 }]}>
              Describe your app idea below and I'll generate it for you
            </Text>
          </View>
        ) : (
          conversationHistory.map((message, index) => (
            <MessageBubble key={index} message={message} index={index} />
          ))
        )}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }]}>
            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder={conversationHistory.length === 0 ? "Describe your app idea..." : "Ask for changes..."}
              placeholderTextColor={colors.text + '80'}
              multiline
              maxLength={500}
              style={[styles.input, { color: colors.inputText }]}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!messageText.trim()}
              style={[
                styles.sendButtonWrapper,
                !messageText.trim() && { opacity: 0.4 },
              ]}
            >
              <LinearGradient
                colors={colors.sendButton}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="arrow-up" size={20} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  previewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  newButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  messageBubbleContainer: {
    width: '100%',
    marginBottom: 16,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codePreview: {
    fontSize: 14,
    marginBottom: 4,
  },
  codeHint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    paddingHorizontal: 16,
  },
  inputContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButtonWrapper: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

