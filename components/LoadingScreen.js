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
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    { text: 'Analyzing your idea', duration: 15000 }, // 0-15s
    { text: 'Designing components', duration: 20000 }, // 15-35s
    { text: 'Writing code', duration: 25000 }, // 35-60s
    { text: 'Finalizing UI', duration: 30000 }, // 60-90s
  ];

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

    // Progress through steps based on time
    const stepTimers = [];
    let cumulativeTime = 0;

    steps.forEach((step, index) => {
      cumulativeTime += step.duration;
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
      }, cumulativeTime);
      stepTimers.push(timer);
    });

    return () => {
      stepTimers.forEach(timer => clearTimeout(timer));
    };
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
          {steps.map((step, index) => (
            <LoadingStep
              key={index}
              text={step.text}
              isDarkMode={isDarkMode}
              isActive={currentStep >= index}
            />
          ))}
        </View>

        {/* Time Estimate */}
        <Text style={[styles.estimate, { color: colors.textSecondary }]}>
          ⏱ This usually takes 60-90 seconds
        </Text>
      </View>
    </LinearGradient>
  );
}

function LoadingStep({ text, isDarkMode, delay, isActive }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  const colors = {
    text: isDarkMode ? '#cbd5e1' : '#4b5563',
    checkmark: isDarkMode ? '#06b6d4' : '#2563eb',
    inactive: isDarkMode ? '#475569' : '#9ca3af',
  };

  return (
    <Animated.View
      style={[
        styles.step,
        {
          opacity: isActive ? fadeAnim : 0.3,
          transform: [{ scale: isActive ? scaleAnim : 0.95 }],
        },
      ]}
    >
      <Text
        style={[
          styles.checkmark,
          { color: isActive ? colors.checkmark : colors.inactive },
        ]}
      >
        {isActive ? '✓' : '○'}
      </Text>
      <Text
        style={[
          styles.stepText,
          { color: isActive ? colors.text : colors.inactive },
        ]}
      >
        {text}
      </Text>
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

