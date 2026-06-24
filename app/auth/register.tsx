import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthContainer } from '../../components/auth/AuthContainer';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { buildApiUrl, getApiNetworkErrorMessage } from '@/lib/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!name || !mobile || !email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl('/api/v1/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, phone: mobile, email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Success: Go to OTP or Login
        router.push({ pathname: '/auth/otp-verification', params: { identifier: email, purpose: 'EMAIL_VERIFICATION' } });
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (error) {
      setErrorMsg(getApiNetworkErrorMessage());
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = password.length >= 8;

  return (
    <AuthContainer>
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100)} 
        style={styles.headerContainer}
      >
        <Text style={styles.brandText}>COURIERX</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join CourierX for seamless deliveries</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(800).delay(200)} 
        style={styles.cardGlowWrapper}
      >
        <BlurView intensity={40} tint="dark" style={styles.glassCard}>
          <View style={styles.formContainer}>
            <AuthInput
              label="FULL NAME"
              placeholder="John Doe"
              icon="user"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <AuthInput
              label="MOBILE NUMBER"
              placeholder="+1 234 567 8900"
              icon="phone"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />

            <AuthInput
              label="EMAIL ADDRESS"
              placeholder="john@example.com"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthInput
              label="PASSWORD"
              placeholder="Create a password"
              icon="lock"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.passwordRequirements}>
              <Feather
                name={isPasswordValid ? "check-circle" : "circle"}
                size={14}
                color={isPasswordValid ? "#A6C63F" : "#5A635A"}
              />
              <Text style={[styles.requirementText, isPasswordValid && styles.requirementTextValid]}>
                Minimum 8 characters
              </Text>
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <AuthButton
              title="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.registerBtn}
            />
          </View>
        </BlurView>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(1000).delay(300)} style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.replace('/auth/login')} style={styles.footerLinkContainer}>
          <Text style={styles.footerLink}>Sign In</Text>
          <Feather name="arrow-right" size={16} color="#A6C63F" style={{ marginLeft: 4 }} />
        </Pressable>
      </Animated.View>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A6C63F',
    letterSpacing: 6,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#B7B7B7',
    fontWeight: '500',
    textAlign: 'center',
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
  passwordRequirements: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: -8,
  },
  requirementText: {
    fontSize: 13,
    color: '#B7B7B7',
    fontWeight: '600',
    marginLeft: 8,
  },
  requirementTextValid: {
    color: '#A6C63F',
  },
  registerBtn: {
    marginTop: 0,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 15,
    color: '#B7B7B7',
    fontWeight: '500',
  },
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 15,
    color: '#A6C63F',
    fontWeight: '700',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});
