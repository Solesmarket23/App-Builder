import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/**
 * PreviewScreen - Displays the generated app in a phone frame
 * @param {Object} props
 * @param {React.Component} props.GeneratedComponent - The dynamically generated component
 * @param {Function} props.onBack - Callback to return to the main screen
 * @param {Function} props.onExport - Callback to export the generated app
 * @param {boolean} props.isDarkMode - Current theme mode
 */
export default function PreviewScreen({
  GeneratedComponent,
  onBack,
  onExport,
  isDarkMode,
}) {
  const colors = {
    background: isDarkMode
      ? ['#020617', '#0f172a', '#020617']
      : ['#f9fafb', '#dbeafe', '#f9fafb'],
    card: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    text: isDarkMode ? '#ffffff' : '#111827',
    textSecondary: isDarkMode ? '#cbd5e1' : '#4b5563',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient colors={colors.background} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Preview
          </Text>
          <TouchableOpacity onPress={onExport} style={styles.exportButton}>
            <LinearGradient
              colors={['#2563eb', '#06b6d4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.exportGradient}
            >
              <Text style={styles.exportText}>Export</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Phone Frame */}
        <View style={styles.previewContainer}>
          <View
            style={[
              styles.phoneFrame,
              {
                backgroundColor: colors.card,
                shadowColor: isDarkMode ? '#000' : '#000',
              },
            ]}
          >
            {/* Phone Notch */}
            <View style={styles.notch} />

            {/* Generated App Container */}
            <View style={styles.appContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {GeneratedComponent ? <GeneratedComponent /> : null}
              </ScrollView>
            </View>

            {/* Phone Home Indicator */}
            <View style={styles.homeIndicator} />
          </View>
        </View>

        {/* Info Text */}
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          This is a live preview of your generated app
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  exportButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  exportGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exportText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  phoneFrame: {
    width: Math.min(width - 40, 380),
    height: height * 0.7,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#1e293b',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  notch: {
    width: 120,
    height: 28,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: 'center',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  homeIndicator: {
    width: 120,
    height: 4,
    backgroundColor: '#94a3b8',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
});

