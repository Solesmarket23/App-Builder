import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Memoized ThinkingIndicator to prevent re-renders
const ThinkingIndicator = React.memo(({ text, colors }) => {
  const dots = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dots, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dots, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.thinkingContainer}>
      <LinearGradient
        colors={colors.thinkingGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.thinkingBubble}
      >
        <View style={styles.thinkingContent}>
          <View style={styles.thinkingIcon}>
            <MaterialIcons name="sync" size={14} color="rgba(255,255,255,0.8)" />
          </View>
          <Text style={styles.thinkingText}>{text}</Text>
        </View>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dots }]} />
          <Animated.View style={[styles.dot, { opacity: dots }]} />
          <Animated.View style={[styles.dot, { opacity: dots }]} />
        </View>
      </LinearGradient>
    </View>
  );
});

// Memoized MessageBubble to prevent re-renders
const MessageBubble = React.memo(({ message, colors }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
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

  if (message.role === 'thinking') {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ThinkingIndicator text={message.text} colors={colors} />
      </Animated.View>
    );
  }

  const isUser = message.role === 'user';

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
            },
          ]}
        >
          <Text style={[styles.messageText, { color: colors.userText }]}>
            {message.text}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: colors.aiBubble,
              borderTopRightRadius: 18,
              borderTopLeftRadius: 4,
            },
          ]}
        >
          <Text style={[styles.messageText, { color: colors.aiText }]}>
            {message.text}
          </Text>
        </View>
      )}
    </Animated.View>
  );
});

/**
 * LoadingScreen - Shows AI thinking process as chat messages
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {string} props.userMessage - The user's app idea
 */
export default function LoadingScreen({ isDarkMode, userMessage }) {
  const [messages, setMessages] = React.useState([]);
  const scrollViewRef = React.useRef(null);

  const colors = React.useMemo(() => ({
    background: isDarkMode ? '#000000' : '#ffffff',
    userBubble: ['#667eea', '#764ba2'],
    aiBubble: isDarkMode ? '#2c2c2e' : '#e5e5ea',
    thinkingGradient: ['#667eea', '#764ba2'],
    userText: '#ffffff',
    aiText: isDarkMode ? '#ffffff' : '#000000',
    text: isDarkMode ? '#ffffff' : '#000000',
    headerBg: isDarkMode ? '#1c1c1e' : '#f9f9f9',
  }), [isDarkMode]);

  React.useEffect(() => {
    // Futuristic AI thinking messages - spread over 15 seconds
    const thinkingFlow = [
      { role: 'user', text: userMessage, delay: 0 },
      { role: 'thinking', text: 'analyzing-request', delay: 800 },
      { role: 'ai', text: 'Request received. Initializing app generation...', delay: 2000 },
      { role: 'thinking', text: 'building-component-structure', delay: 3500 },
      { role: 'ai', text: 'Component architecture mapped', delay: 5000 },
      { role: 'thinking', text: 'designing-ui-layout', delay: 6500 },
      { role: 'ai', text: 'UI layout optimized for iOS', delay: 8000 },
      { role: 'thinking', text: 'implementing-state-management', delay: 9500 },
      { role: 'ai', text: 'State hooks configured', delay: 11000 },
      { role: 'thinking', text: 'applying-design-system', delay: 12500 },
      { role: 'ai', text: 'Design system applied', delay: 14000 },
    ];

    const timers = [];
    
    thinkingFlow.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, { ...msg, id: index }]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, msg.delay);
      timers.push(timer);
    });

    // Cleanup timers on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [userMessage]);

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
            colors={colors.thinkingGradient}
            style={styles.aiAvatar}
          >
            <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: colors.text, opacity: 0.6 }]}>
              Generating your app...
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} colors={colors} />
        ))}
      </ScrollView>
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubbleContainer: {
    width: '100%',
    marginBottom: 16,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '75%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  thinkingContainer: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  thinkingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '70%',
    borderTopLeftRadius: 4,
  },
  thinkingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thinkingIcon: {
    marginRight: 8,
  },
  thinkingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});
