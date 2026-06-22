import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthContainer } from '../../components/auth/AuthContainer';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Dummy action to go to OTP
      router.push('/auth/otp-verification');
    }, 1500);
  };

  return (
    <AuthContainer>
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100)} 
        style={styles.headerContainer}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
        
        <Text style={styles.brandText}>COURIERX</Text>
        <Text style={styles.title}>Recovery</Text>
        <Text style={styles.subtitle}>
          Enter your email or mobile number linked to your account and we will send you a verification code.
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(800).delay(200)} 
        style={styles.cardGlowWrapper}
      >
        <BlurView intensity={40} tint="dark" style={styles.glassCard}>
          <View style={styles.formContainer}>
            <AuthInput
              label="EMAIL OR MOBILE NUMBER"
              placeholder="Enter email or mobile"
              icon="mail"
              value={contact}
              onChangeText={setContact}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthButton
              title="Send OTP"
              onPress={handleSendOtp}
              isLoading={isLoading}
              style={styles.ctaBtn}
            />
          </View>
        </BlurView>
      </Animated.View>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A6C63F',
    letterSpacing: 6,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#B7B7B7',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  cardGlowWrapper: {
    shadowColor: 'rgba(166,198,63,0.35)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 20,
    marginBottom: 32,
    width: '100%',
  },
  glassCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 18, 16, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  formContainer: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  ctaBtn: {
    marginTop: 12,
  },
});
