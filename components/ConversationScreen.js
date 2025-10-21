import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

/**
 * ConversationScreen - Shows chat-style conversation during app modification
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {string} props.userRequest - The modification request from user
 */
export default function ConversationScreen({ isDarkMode, userRequest }) {
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);

  const conversationFlow = [
    { role: 'user', text: userRequest, delay: 0 },
    { role: 'assistant', text: 'Got it! Let me update your app...', delay: 500 },
    { role: 'assistant', text: 'Analyzing your request', delay: 2000 },
    { role: 'assistant', text: 'Modifying the component structure', delay: 5000 },
    { role: 'assistant', text: 'Updating styles and colors', delay: 8000 },
    { role: 'assistant', text: 'Testing the changes', delay: 11000 },
    { role: 'assistant', text: 'Almost done...', delay: 14000 },
    { role: 'assistant', text: 'Your app has been updated!', delay: 16000 },
  ];

  useEffect(() => {
    conversationFlow.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { ...msg, id: index }]);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, msg.delay);
    });
  }, []);

  const colors = {
    background: isDarkMode
      ? ['#000000', '#1a1a1a']
      : ['#ffffff', '#f5f5f5'],
    userBubble: isDarkMode ? '#007AFF' : '#007AFF',
    assistantBubble: isDarkMode ? '#2c2c2e' : '#e5e5ea',
    userText: '#ffffff',
    assistantText: isDarkMode ? '#ffffff' : '#000000',
    text: isDarkMode ? '#ffffff' : '#000000',
  };

  const MessageBubble = ({ message }) => {
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
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? colors.userBubble : colors.assistantBubble,
              borderTopRightRadius: isUser ? 4 : 18,
              borderTopLeftRadius: isUser ? 18 : 4,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? colors.userText : colors.assistantText },
            ]}
          >
            {message.text}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient colors={colors.background} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={[styles.aiAvatar, { backgroundColor: '#007AFF' }]}>
              <Text style={styles.avatarText}>AI</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                AI Assistant
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.text, opacity: 0.6 }]}>
                Updating your app
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
            <MessageBubble key={message.id} message={message} />
          ))}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerTextContainer: {
    flex: 1,
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
    marginBottom: 12,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

