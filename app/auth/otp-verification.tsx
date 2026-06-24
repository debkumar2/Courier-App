import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthContainer } from '../../components/auth/AuthContainer';
import { OtpInput } from '../../components/auth/OtpInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { buildApiUrl, getApiNetworkErrorMessage } from '@/lib/api';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { identifier, purpose } = useLocalSearchParams<{ identifier: string; purpose: string }>();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const handleVerify = async () => {
    if (!identifier || otp.length !== 6) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(buildApiUrl('/api/v1/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, purpose: purpose || 'EMAIL_VERIFICATION' }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (purpose === 'PASSWORD_RESET') {
          router.push({ pathname: '/auth/reset-password', params: { identifier, otp } });
        } else {
          router.replace('/auth/login');
        }
      } else {
        setErrorMsg(data.message || 'Invalid OTP code');
      }
    } catch (error) {
      setErrorMsg(getApiNetworkErrorMessage());
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(30);
    setOtp('');
    setErrorMsg('');
    if (!identifier) return;

    try {
      await fetch(buildApiUrl('/api/v1/auth/resend-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, purpose: purpose || 'EMAIL_VERIFICATION' }),
      });
    } catch (error) {
      setErrorMsg(getApiNetworkErrorMessage());
    }
  };

  const maskContact = (contact?: string) => {
    if (!contact) return 'unknown';
    if (contact.includes('@')) {
      const [name, domain] = contact.split('@');
      return `${name.charAt(0)}***@${domain}`;
    }
    return `${contact.substring(0, 3)}***${contact.substring(contact.length - 2)}`;
  };

  const maskedContact = maskContact(identifier);

  return (
    <AuthContainer>
      <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.brandText}>COURIERX</Text>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          We have sent a verification code to{`\n`}
          <Text style={styles.highlightText}>{maskedContact}</Text>
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.cardGlowWrapper}>
        <BlurView intensity={40} tint="dark" style={styles.glassCard}>
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>ENTER OTP CODE</Text>
            <OtpInput value={otp} onChange={setOtp} length={6} />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              {timer > 0 ? (
                <Text style={styles.timerText}>00:{timer.toString().padStart(2, '0')}</Text>
              ) : (
                <Pressable onPress={handleResend} style={styles.resendAction}>
                  <Text style={styles.resendLink}>Resend Now</Text>
                </Pressable>
              )}
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <AuthButton
              title="Verify Account"
              onPress={handleVerify}
              isLoading={isLoading}
              disabled={otp.length !== 6}
              style={styles.verifyBtn}
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
  highlightText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B7B7B7',
    marginBottom: 16,
    marginLeft: 4,
    letterSpacing: 1,
  },
  verifyBtn: {
    marginTop: 12,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#B7B7B7',
    fontWeight: '500',
  },
  timerText: {
    fontSize: 14,
    color: '#A6C63F',
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  resendAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendLink: {
    fontSize: 14,
    color: '#A6C63F',
    fontWeight: '800',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});
