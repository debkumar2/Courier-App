import React, { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View, SafeAreaView, StatusBar, Pressable, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
  withDelay,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const { width, height } = Dimensions.get('window');

const Ripple = ({ delay }: { delay: number }) => {
  const progress = useSharedValue(0);
  
  useEffect(() => {
    progress.value = withDelay(
      delay, 
      withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.out(Easing.ease) }), 
        -1, 
        false
      )
    );
  }, [delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.5, 3], 'clamp') }],
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.6, 0], 'clamp'),
  }));

  return <Animated.View style={[styles.ripple, style]} />;
};

const ElegantRing = () => {
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }]
  }));

  return (
    <Animated.View style={[styles.elegantRing, style]}>
       <View style={styles.ringDash} />
       <View style={[styles.ringDash, { bottom: -1, top: undefined }]} />
    </Animated.View>
  );
};

const Loader = ({ onFinish }: { onFinish: () => void }) => {
  const progress = useSharedValue(0);
  const isPressed = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(100, { duration: 4000, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) {
        runOnJS(onFinish)();
      }
    });
  }, []);

  const handlePressIn = () => {
    isPressed.value = 1;
    const remaining = 100 - progress.value;
    if (remaining > 0) {
      progress.value = withTiming(100, { duration: remaining * 5, easing: Easing.out(Easing.exp) }, (finished) => {
        if (finished) {
           runOnJS(onFinish)();
        }
      });
    }
  };

  const handlePressOut = () => {
    isPressed.value = 0;
  };

  const dashStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    backgroundColor: isPressed.value === 1 ? '#FFFFFF' : '#A8F62A',
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(isPressed.value === 1 ? 1.1 : 1, { duration: 150 }) }],
    opacity: withTiming(isPressed.value === 1 ? 0.9 : 1, { duration: 150 })
  }));

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.floor(progress.value)}%`,
      value: `${Math.floor(progress.value)}%`,
    } as any;
  });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.loaderContainer, containerStyle]}>
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderDash, dashStyle]} />
        </View>
        <AnimatedTextInput
          editable={false}
          animatedProps={animatedTextProps}
          style={styles.percentageText}
        />
      </Animated.View>
    </Pressable>
  );
};

export default function SplashScreenView() {
  const floatAnim = useSharedValue(0);
  const introAnim = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    floatAnim.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    introAnim.value = withDelay(
      300,
      withTiming(1, { duration: 2500, easing: Easing.out(Easing.exp) })
    );
  }, []);

  const packageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatAnim.value, [0, 1], [-6, 6], 'clamp') }],
    opacity: interpolate(introAnim.value, [0, 0.3], [0, 1], 'clamp'),
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(introAnim.value, [0.4, 1], [0, 1], 'clamp'),
    transform: [{ translateY: interpolate(introAnim.value, [0.4, 1], [20, 0], 'clamp') }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: interpolate(introAnim.value, [0.2, 1], [0, 80], 'clamp'),
    opacity: interpolate(introAnim.value, [0.2, 1], [0, 1], 'clamp'),
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(introAnim.value, [0, 1], [0, 1], 'clamp'),
  }));

  const handleFinish = () => {
    router.replace('/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={false} />
      
      <Animated.View style={[styles.bgOverlay, bgStyle]}>
        <View style={styles.ambientOrb} />
        <View style={[styles.gridLine, { top: '30%' }]} />
        <View style={[styles.gridLine, { top: '70%' }]} />
        <View style={[styles.gridLineVertical, { left: '30%' }]} />
        <View style={[styles.gridLineVertical, { left: '70%' }]} />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.spacer} />

        <View style={styles.centerContainer}>
          <Ripple delay={0} />
          <Ripple delay={2000} />
          <ElegantRing />
          
          <Animated.View style={[styles.iconContainer, packageStyle]}>
             <View style={styles.iconBackdrop} />
             <Feather name="box" size={46} color="#A8F62A" style={styles.iconGlow} />
          </Animated.View>
        </View>

        <Animated.View style={[styles.brandContainer, textStyle]}>
          <Animated.View style={[styles.divider, lineStyle]} />
          
          <Text style={styles.brandTitle}>
            Best<Text style={styles.brandTitleAccent}>Courier</Text>
          </Text>
          <Text style={styles.brandSubtitle}>FAST, SAFE, ON TIME</Text>
          <Loader onFinish={handleFinish} />
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#343B33' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ambientOrb: { position: 'absolute', width: width * 1.5, height: width * 1.5, borderRadius: width * 0.75, backgroundColor: '#A8F62A', opacity: 0.03, top: -width * 0.4 },
  gridLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#FFFFFF', opacity: 0.02 },
  gridLineVertical: { position: 'absolute', height: '100%', width: 1, backgroundColor: '#FFFFFF', opacity: 0.02 },
  safeArea: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  spacer: { flex: 0.3 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  ripple: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#A8F62A' },
  elegantRing: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1, borderColor: 'rgba(168, 246, 42, 0.08)', alignItems: 'center' },
  ringDash: { position: 'absolute', top: -1, width: 40, height: 2, backgroundColor: '#A8F62A', shadowColor: '#A8F62A', shadowOpacity: 0.8, shadowRadius: 4, borderRadius: 1 },
  iconContainer: { alignItems: 'center', justifyContent: 'center', width: 100, height: 100 },
  iconBackdrop: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(168, 246, 42, 0.04)', borderWidth: 1, borderColor: 'rgba(168, 246, 42, 0.1)' },
  iconGlow: { shadowColor: '#A8F62A', shadowOpacity: 0.5, shadowRadius: 10 },
  brandContainer: { flex: 0.5, alignItems: 'center', justifyContent: 'flex-start', width: '100%' },
  divider: { height: 2, backgroundColor: '#A8F62A', marginBottom: 40, shadowColor: '#A8F62A', shadowOpacity: 0.6, shadowRadius: 6, borderRadius: 1 },
  brandTitle: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif', fontSize: 32, fontWeight: '700', letterSpacing: 2, color: '#FFFFFF' },
  brandTitleAccent: { fontWeight: '300', color: '#A8F62A' },
  brandSubtitle: { fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif', fontSize: 12, fontWeight: '500', letterSpacing: 4, color: '#909A8F', marginTop: 12 },
  loaderContainer: { marginTop: 30, width: 120, height: 40, alignItems: 'center', justifyContent: 'center' },
  percentageText: { color: '#A8F62A', fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'monospace', fontSize: 10, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  loaderTrack: { width: '100%', height: 2, backgroundColor: 'rgba(168, 246, 42, 0.15)', borderRadius: 1, overflow: 'hidden' },
  loaderDash: { height: '100%', backgroundColor: '#A8F62A', borderRadius: 1, shadowColor: '#A8F62A', shadowOpacity: 1, shadowRadius: 5, elevation: 3 }
});