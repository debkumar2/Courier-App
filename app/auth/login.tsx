import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthContainer } from '../../components/auth/AuthContainer';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { SocialButton } from '../../components/auth/SocialButton';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Dummy action
    }, 1500);
  };

  return (
    <AuthContainer>
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100)} 
        style={styles.headerContainer}
      >
        <Text style={styles.brandText}>COURIERX</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your details to access your account</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(800).delay(200)} 
        style={styles.cardGlowWrapper}
      >
        <BlurView intensity={40} tint="dark" style={styles.glassCard}>
          <View style={styles.formContainer}>
            <AuthInput
              label="EMAIL OR MOBILE NUMBER"
              placeholder="Enter your email or mobile"
              icon="user"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthInput
              label="PASSWORD"
              placeholder="Enter your password"
              icon="lock"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.optionsContainer}>
              <Pressable style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Feather name="check" size={12} color="#050606" />}
                </View>
                <Text style={styles.checkboxLabel}>Remember Me</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/auth/forgot-password')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <AuthButton
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.signInBtn}
            />
          </View>
        </BlurView>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(800).delay(300)}>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <SocialButton provider="google" onPress={() => {}} style={styles.socialBtn} />
          <SocialButton provider="apple" onPress={() => {}} style={styles.socialBtn} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(1000).delay(400)} style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable onPress={() => router.push('/auth/register')} style={styles.footerLinkContainer}>
          <Text style={styles.footerLink}>Create Account</Text>
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
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: -8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#5A635A',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#A6C63F',
    borderColor: '#A6C63F',
    shadowColor: '#A6C63F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#B7B7B7',
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#A6C63F',
    fontWeight: '600',
  },
  signInBtn: {
    marginTop: 0,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#5A635A',
    fontWeight: '800',
    letterSpacing: 2,
  },
  socialContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  socialBtn: {
    width: '100%',
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
});
