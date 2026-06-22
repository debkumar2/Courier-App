import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View, SafeAreaView, StatusBar, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Fast Delivery',
    description: 'Deliver packages across cities with real-time tracking and lightning-fast delivery.',
    icon: 'truck',
    features: [
      { icon: 'zap', label: 'Same-Day Delivery' },
      { icon: 'map-pin', label: 'Live Tracking' },
      { icon: 'lock', label: 'Secure Shipping' },
    ]
  },
  {
    id: '2',
    title: 'Smart Logistics',
    description: 'AI-powered route optimization ensuring your package arrives exactly when expected.',
    icon: 'cpu',
    features: [
      { icon: 'git-merge', label: 'Smart Routing' },
      { icon: 'clock', label: 'Precise ETA' },
      { icon: 'shield', label: 'Package Protection' },
    ]
  },
  {
    id: '3',
    title: 'Premium Quality',
    description: 'Experience the future of logistics with our world-class delivery infrastructure.',
    icon: 'star',
    features: [
      { icon: 'award', label: 'Top Rated' },
      { icon: 'heart', label: 'Careful Handling' },
      { icon: 'headphones', label: '24/7 Support' },
    ]
  }
];

const LayeredBackground = () => (
  <View style={StyleSheet.absoluteFillObject}>
    <LinearGradient colors={['#161A16', '#0F110F', '#080908']} style={StyleSheet.absoluteFillObject} />

    <Animated.View style={[styles.orb, { top: -150, left: -100, width: 500, height: 500, backgroundColor: '#B4E33D', opacity: 0.25 }]} />
    <Animated.View style={[styles.orb, { bottom: height * 0.1, right: -200, width: 600, height: 600, backgroundColor: '#FF9F1C', opacity: 0.2 }]} />
    <Animated.View style={[styles.orb, { top: height * 0.35, left: -50, width: 300, height: 300, backgroundColor: '#B4E33D', opacity: 0.15 }]} />

    <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
    <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
  </View>
);

const Header = () => (
  <SafeAreaView style={styles.headerSafeArea} pointerEvents="none">
    <View style={styles.headerContainer}>
      <BlurView intensity={80} tint="dark" style={styles.headerGlass}>
        <View style={styles.logoIconContainer}>
          <Feather name="package" size={16} color="#111311" />
          <View style={styles.logoPin}>
            <Feather name="map-pin" size={10} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.headerTitle}>CourierX</Text>
      </BlurView>
    </View>
  </SafeAreaView>
);

const Pagination = ({ scrollX }: { scrollX: Animated.SharedValue<number> }) => (
  <View style={styles.paginationContainer}>
    {ONBOARDING_DATA.map((_, index) => {
      const dotStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const dotWidth = interpolate(scrollX.value, inputRange, [8, 32, 8], 'clamp');
        const color = interpolateColor(scrollX.value, inputRange, ['rgba(255, 255, 255, 0.2)', '#B4E33D', 'rgba(255, 255, 255, 0.2)']);
        return { width: dotWidth, backgroundColor: color };
      });
      return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
    })}
  </View>
);

const PrimaryCTA = ({ onPress, text }: { onPress: () => void, text: string }) => {
  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withTiming(0.96, { duration: 150 }); }}
      onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
      onPress={onPress}
      style={{ width: '100%', marginTop: 24 }}
    >
      <Animated.View style={[styles.ctaButton, buttonStyle]}>
        <LinearGradient
          colors={['#B4E33D', '#A1CC34']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>{text}</Text>
          <Feather name="arrow-right" size={20} color="#111311" style={{ marginLeft: 8 }} />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

export default function OnboardingScreen() {
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentIndex + 1), y: 0, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      <LayeredBackground />
      <Header />

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
      >
        {ONBOARDING_DATA.map((item, index) => {
          // Slide animations
          const slideStyle = useAnimatedStyle(() => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const translateY = interpolate(scrollX.value, inputRange, [40, 0, 40], 'clamp');
            const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], 'clamp');
            return { opacity, transform: [{ translateY }] };
          });

          // Hero floating animation
          const floatAnim = useSharedValue(0);
          useEffect(() => {
            floatAnim.value = withDelay(index * 200, withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }), -1, true));
          }, []);
          const heroFloatStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: interpolate(floatAnim.value, [0, 1], [-12, 12]) }]
          }));

          return (
            <View style={styles.slide} key={item.id}>

              {/* Hero Section */}
              <View style={styles.heroSection}>
                {/* Ambient glow behind hero */}
                <Animated.View style={[styles.ambientGlow, slideStyle]} />

                <Animated.View style={[styles.heroGlassContainer, slideStyle, heroFloatStyle]}>
                  <BlurView intensity={50} tint="dark" style={styles.heroGlass}>
                    <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.01)']} style={StyleSheet.absoluteFillObject} />
                    <Feather name={item.icon as any} size={110} color="#FFFFFF" style={styles.heroIconShadow} />
                  </BlurView>

                  {/* Floating particles */}
                  <Animated.View style={[styles.particle, { top: -10, right: 20, shadowColor: '#FF9F1C' }]}>
                    <Feather name="box" size={28} color="#FF9F1C" />
                  </Animated.View>
                  <Animated.View style={[styles.particle, { bottom: 10, left: 10, shadowColor: '#B4E33D' }]}>
                    <Feather name="map-pin" size={32} color="#B4E33D" />
                  </Animated.View>
                </Animated.View>
              </View>

              {/* Content Section */}
              <Animated.View style={[styles.contentSection, slideStyle]}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.featuresContainer}>
                  {item.features.map((feat, i) => (
                    <View style={styles.featurePill} key={i}>
                      <BlurView intensity={50} tint="dark" style={styles.featureGlass}>
                        <Feather name={feat.icon as any} size={14} color="#B4E33D" />
                        <Text style={styles.featureText}>{feat.label}</Text>
                      </BlurView>
                    </View>
                  ))}
                </View>
              </Animated.View>

            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Floating Bottom Card */}
      <View style={styles.bottomCardContainer} pointerEvents="box-none">
        <View style={styles.bottomGlassCardWrapper}>
          <BlurView intensity={80} tint="dark" style={styles.bottomGlassCard}>
            <LinearGradient colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.01)']} style={StyleSheet.absoluteFillObject} />
            <View style={styles.bottomCardContent}>
              <Pagination scrollX={scrollX} />
              <PrimaryCTA
                onPress={handleNext}
                text={currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Continue'}
              />
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111311' },
  orb: { position: 'absolute', borderRadius: 999 },

  headerSafeArea: { position: 'absolute', top: 0, width: '100%', zIndex: 10 },
  headerContainer: { alignItems: 'center', marginTop: Platform.OS === 'ios' ? 10 : 40 },
  headerGlass: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)', shadowColor: '#B4E33D', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  logoIconContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#B4E33D', padding: 8, borderRadius: 12, marginRight: 10, shadowColor: '#B4E33D', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  logoPin: { position: 'absolute', right: -6, bottom: -6, backgroundColor: '#FF9F1C', borderRadius: 10, padding: 2, borderWidth: 2, borderColor: '#161A16' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 },

  slide: { width, height: '100%', alignItems: 'center', paddingTop: height * 0.15 },

  heroSection: { height: height * 0.35, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  ambientGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#FF9F1C', shadowColor: '#FF9F1C', shadowOpacity: 0.5, shadowRadius: 80, elevation: 15, opacity: 0.25 },
  heroGlassContainer: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  heroGlass: { width: '100%', height: '100%', borderRadius: 120, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', shadowColor: '#B4E33D', shadowOpacity: 0.15, shadowRadius: 40, shadowOffset: { width: 0, height: 20 } },
  heroIconShadow: { shadowColor: '#FFFFFF', shadowOpacity: 0.3, shadowRadius: 25, shadowOffset: { width: 0, height: 10 } },
  particle: { position: 'absolute', shadowOpacity: 0.6, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },

  contentSection: { flex: 1, width: '100%', paddingHorizontal: 30, alignItems: 'center' },
  title: { fontSize: 38, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 16, letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 10, textShadowOffset: { width: 0, height: 4 } },
  description: { fontSize: 16, fontWeight: '500', color: '#A1A6A1', textAlign: 'center', maxWidth: 280, lineHeight: 24, marginBottom: 30, opacity: 0.95 },

  featuresContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  featurePill: { borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  featureGlass: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  featureText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginLeft: 6 },

  bottomCardContainer: { position: 'absolute', bottom: Platform.OS === 'ios' ? 30 : 20, width: '100%', paddingHorizontal: 20, zIndex: 20 },
  bottomGlassCardWrapper: { width: '100%', borderRadius: 32, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 40, shadowOffset: { width: 0, height: 20 }, elevation: 15 },
  bottomGlassCard: { width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  bottomCardContent: { padding: 30, alignItems: 'center' },

  paginationContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },

  ctaButton: { width: '100%', height: 60, borderRadius: 30, overflow: 'hidden', shadowColor: '#B4E33D', shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  ctaGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#111311', letterSpacing: 0.5 },
});
