import React, { useEffect, useState, createContext, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, RadialGradient, Stop, Pattern, Circle, Rect, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface AuthContextType {
  isKeyboardVisible: boolean;
}

const AuthContext = createContext<AuthContextType>({ isKeyboardVisible: false });

export const useAuthContext = () => useContext(AuthContext);

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isKeyboardVisible }}>
      <SafeAreaView style={styles.safeArea}>
        {/* Deep Black to Green Gradient Background */}
        <LinearGradient
          colors={['#050606', '#091008', '#050606']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Ambient SVG Background Layer */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Svg height="100%" width="100%">
            <Defs>
              <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="#A6C63F" stopOpacity="0.15" />
                <Stop offset="100%" stopColor="#A6C63F" stopOpacity="0" />
              </RadialGradient>
              
              <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.03)" />
              </Pattern>

              <SvgLinearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#A6C63F" stopOpacity="0.6" />
                <Stop offset="100%" stopColor="#A6C63F" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>

            {/* Dotted Texture */}
            <View style={StyleSheet.absoluteFillObject}>
              <Svg width="100%" height="100%">
                <Rect width="100%" height="100%" fill="url(#dots)" />
              </Svg>
            </View>

            {/* Top Left Neon Wave */}
            <Path
              d={`M -50 100 Q ${width * 0.3} 150 ${width * 0.6} -50`}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <Path
              d={`M -50 120 Q ${width * 0.3} 180 ${width * 0.7} -50`}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />

            {/* Bottom Right Neon Wave */}
            <Path
              d={`M ${width + 50} ${height - 100} Q ${width * 0.7} ${height - 150} ${width * 0.4} ${height + 50}`}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <Path
              d={`M ${width + 50} ${height - 120} Q ${width * 0.7} ${height - 180} ${width * 0.3} ${height + 50}`}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />

            {/* Center Radial Glow behind the card */}
            <Circle cx="50%" cy="50%" r={width * 0.8} fill="url(#centerGlow)" />
          </Svg>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050606',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
});
