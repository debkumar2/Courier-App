import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { buildApiUrl, getApiNetworkErrorMessage } from '@/lib/api';
import { AuthButton } from '../../components/auth/AuthButton';
import { AuthContainer } from '../../components/auth/AuthContainer';
import { AuthInput } from '../../components/auth/AuthInput';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { identifier, otp } = useLocalSearchParams<{ identifier: string; otp: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!identifier || !otp) {
      setErrorMsg('Reset session expired. Please request a new code.');
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch(buildApiUrl('/api/v1/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        router.replace('/auth/login');
      } else {
        setErrorMsg(data.message || 'Unable to reset password.');
      }
    } catch (error) {
      setErrorMsg(getApiNetworkErrorMessage());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.brandText}>COURIERX</Text>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Create a new password for your account.</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.cardGlowWrapper}>
        <BlurView intensity={40} tint="dark" style={styles.glassCard}>
          <View style={styles.formContainer}>
            <AuthInput
              label="NEW PASSWORD"
              placeholder="Create a strong password"
              icon="lock"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <AuthInput
              label="CONFIRM PASSWORD"
              placeholder="Re-enter your password"
              icon="lock"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <AuthButton
              title="Reset Password"
              onPress={handleResetPassword}
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
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});
