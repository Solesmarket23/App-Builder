import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

/**
 * LoadingScreen - Shows conversational AI messages during app generation
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Current theme mode
 */
export default function LoadingScreen({ isDarkMode }) {
  const [messages, setMessages] = React.useState([]);
  const scrollViewRef = React.useRef(null);

  const conversationFlow = [
    { role: 'ai', text: '👋 Hi! I\'m analyzing your app idea...', delay: 500 },
    { role: 'ai', text: '💡 Great concept! Let me start by planning the UI components.', delay: 3000 },
    { role: 'ai', text: '🎨 Choosing a beautiful color palette that matches your vision...', delay: 6000 },
    { role: 'user', text: 'How\'s it looking?', delay: 10000 },
    { role: 'ai', text: '✨ Looking good! Creating the component structure now.', delay: 12000 },
    { role: 'ai', text: '⚛️ Writing React hooks for state management...', delay: 18000 },
    { role: 'ai', text: '🔧 Building interactive elements - buttons, inputs, navigation...', delay: 25000 },
    { role: 'user', text: 'Will it be responsive?', delay: 32000 },
    { role: 'ai', text: '✅ Absolutely! Adding responsive styling now.', delay: 34000 },
    { role: 'ai', text: '🎭 Adding smooth animations and transitions...', delay: 42000 },
    { role: 'ai', text: '📱 Optimizing for iOS and making sure everything works perfectly...', delay: 52000 },
    { role: 'ai', text: '🔍 Running final checks and validations...', delay: 62000 },
    { role: 'ai', text: '🎉 Almost done! Finalizing your app...', delay: 72000 },
  ];

  React.useEffect(() => {
    const timers = [];

    conversationFlow.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, { ...msg, id: index }]);
        // Auto-scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, msg.delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const colors = {
    background: isDarkMode
      ? ['#020617', '#0f172a', '#020617']
      : ['#f9fafb', '#dbeafe', '#f9fafb'],
    aiMessageBg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    userMessageBg: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)',
    aiText: isDarkMode ? '#e0e7ff' : '#1e40af',
    userText: isDarkMode ? '#cbd5e1' : '#475569',
    headerText: isDarkMode ? '#ffffff' : '#111827',
    subtitleText: isDarkMode ? '#94a3b8' : '#64748b',
  };

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiAvatarContainer}>
          <LinearGradient
            colors={['#3b82f6', '#06b6d4']}
            style={styles.aiAvatar}
          >
            <Text style={styles.aiAvatarText}>AI</Text>
          </LinearGradient>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>
            Building Your App
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtitleText }]}>
            ⏱ This usually takes 60-90 seconds
          </Text>
        </View>
      </View>

      {/* Conversation */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.conversationContainer}
        contentContainerStyle={styles.conversationContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <ConversationMessage
            key={message.id}
            message={message}
            colors={colors}
            isDarkMode={isDarkMode}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

function ConversationMessage({ message, colors, isDarkMode }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isAI = message.role === 'ai';

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isAI ? styles.aiMessageContainer : styles.userMessageContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {isAI && (
        <View style={styles.smallAvatarContainer}>
          <LinearGradient
            colors={['#3b82f6', '#06b6d4']}
            style={styles.smallAvatar}
          >
            <Text style={styles.smallAvatarText}>AI</Text>
          </LinearGradient>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: isAI ? colors.aiMessageBg : colors.userMessageBg,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isAI ? colors.aiText : colors.userText },
          ]}
        >
          {message.text}
        </Text>
      </View>
      {!isAI && (
        <View style={styles.userAvatarContainer}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>You</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  aiAvatarContainer: {
    marginRight: 12,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  conversationContainer: {
    flex: 1,
  },
  conversationContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  smallAvatarContainer: {
    marginRight: 8,
    marginBottom: 2,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  userAvatarContainer: {
    marginLeft: 8,
    marginBottom: 2,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
});

