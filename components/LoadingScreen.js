import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

/**
 * LoadingScreen - Shows animated loading state during app generation
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Current theme mode
 */
export default function LoadingScreen({ isDarkMode }) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const pulseValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colors = {
    background: isDarkMode
      ? ['#020617', '#0f172a', '#020617']
      : ['#f9fafb', '#dbeafe', '#f9fafb'],
    text: isDarkMode ? '#ffffff' : '#111827',
    textSecondary: isDarkMode ? '#cbd5e1' : '#4b5563',
  };

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <View style={styles.content}>
        {/* Spinning Gradient Circle */}
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              transform: [{ rotate: spin }, { scale: pulseValue }],
            },
          ]}
        >
          <LinearGradient
            colors={['#2563eb', '#06b6d4', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spinner}
          >
            <View style={styles.spinnerInner} />
          </LinearGradient>
        </Animated.View>

        {/* Loading Text */}
        <Text style={[styles.title, { color: colors.text }]}>
          Generating Your App
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          AI is crafting your vision...
        </Text>

        {/* Progress Steps */}
        <View style={styles.stepsContainer}>
          <LoadingStep
            text="Analyzing your idea"
            isDarkMode={isDarkMode}
            delay={0}
          />
          <LoadingStep
            text="Designing components"
            isDarkMode={isDarkMode}
            delay={1000}
          />
          <LoadingStep
            text="Writing code"
            isDarkMode={isDarkMode}
            delay={2000}
          />
          <LoadingStep
            text="Finalizing UI"
            isDarkMode={isDarkMode}
            delay={3000}
          />
        </View>

        {/* Time Estimate */}
        <Text style={[styles.estimate, { color: colors.textSecondary }]}>
          ⏱ This usually takes 60-90 seconds
        </Text>
      </View>
    </LinearGradient>
  );
}

function LoadingStep({ text, isDarkMode, delay }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const colors = {
    text: isDarkMode ? '#cbd5e1' : '#4b5563',
    checkmark: isDarkMode ? '#06b6d4' : '#2563eb',
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.step, { opacity: fadeAnim }]}>
      <Text style={[styles.checkmark, { color: colors.checkmark }]}>✓</Text>
      <Text style={[styles.stepText, { color: colors.text }]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  spinnerContainer: {
    marginBottom: 48,
  },
  spinner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 48,
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 32,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 16,
  },
  estimate: {
    fontSize: 14,
    textAlign: 'center',
  },
});

