import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const displayFont = Platform.select({ ios: 'SF Pro Display', android: 'sans-serif-medium', default: 'SF Pro Display' });

export default function SplashScreenView() {
  const floatValue = useRef(new Animated.Value(0)).current;
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 1200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();
    shimmerAnimation.start();
    pulseAnimation.start();

    return () => {
      floatAnimation.stop();
      shimmerAnimation.stop();
      pulseAnimation.stop();
    };
  }, [floatValue, shimmerValue, pulseValue]);

  const floatTranslateY = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const floatScale = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.025],
  });

  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-160, 260],
  });

  const pulseScale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const pulseOpacity = pulseValue.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.12, 0.28, 0.06],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={styles.glowCenter} />
        <View style={styles.glowUpper} />
        <View style={styles.glowLower} />
        <View style={styles.gridLine} />

        <View style={styles.topRail}>
          <View style={styles.launchChip}>
            <View style={styles.launchDot} />
            <Text style={styles.launchText}>Live dispatch ready</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.heroArea}>
            <Animated.View
              style={[
                styles.orbitRing,
                {
                  opacity: pulseOpacity,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.logoCard,
                {
                  transform: [{ translateY: floatTranslateY }, { scale: floatScale }],
                },
              ]}
            >
              <View style={styles.logoGlass} />
              <View style={styles.logoStage}>
                <View style={styles.routeLine} />
                <View style={styles.routeNodeStart} />
                <View style={styles.routeNodeEnd} />
                <View style={styles.motionGroup}>
                  <View style={styles.motionLineStrong} />
                  <View style={styles.motionLineMedium} />
                  <View style={styles.motionLineSoft} />
                </View>

                <View style={styles.boxGlow} />
                <View style={styles.boxCore} />
                <View style={styles.boxTop} />
                <View style={styles.boxCutLeft} />
                <View style={styles.boxCutRight} />
                <View style={styles.pinBody} />
                <View style={styles.pinHole} />
                <View style={styles.pinTail} />
                <View style={styles.packageLine} />
              </View>
            </Animated.View>

            <View style={styles.featureRow}>
              <View style={styles.featureCard}>
                <Text style={styles.featureValue}>02m</Text>
                <Text style={styles.featureLabel}>pickup ETA</Text>
              </View>
              <View style={styles.featureCardAccent}>
                <Text style={styles.featureValueAccent}>99.9%</Text>
                <Text style={styles.featureLabelAccent}>tracking uptime</Text>
              </View>
            </View>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.appName}>CourierX</Text>
            <Text style={styles.tagline}>Fast \u2022 Secure \u2022 Reliable</Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <View style={styles.loaderShell}>
            <View style={styles.loaderTrack}>
              <View style={styles.loaderFill} />
              <Animated.View
                style={[
                  styles.loaderShine,
                  {
                    transform: [{ translateX: shimmerTranslateX }],
                  },
                ]}
              />
            </View>
          </View>
          <Text style={styles.footerText}>Powered by CourierX</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  glowCenter: {
    position: 'absolute',
    alignSelf: 'center',
    top: '16%',
    width: 360,
    height: 360,
    borderRadius: 360,
    backgroundColor: 'rgba(47, 128, 255, 0.11)',
  },
  glowUpper: {
    position: 'absolute',
    top: 70,
    left: -72,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(90, 169, 255, 0.08)',
  },
  glowLower: {
    position: 'absolute',
    right: -58,
    bottom: 138,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(47, 128, 255, 0.06)',
  },
  gridLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '47%',
    height: 1,
    backgroundColor: 'rgba(26, 35, 51, 0.04)',
  },
  topRail: {
    paddingTop: 8,
    alignItems: 'center',
  },
  launchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(47, 128, 255, 0.10)',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  launchDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#2F80FF',
  },
  launchText: {
    color: '#1A2333',
    fontFamily: displayFont,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  orbitRing: {
    position: 'absolute',
    width: 254,
    height: 254,
    borderRadius: 254,
    borderWidth: 1,
    borderColor: 'rgba(47, 128, 255, 0.10)',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  logoCard: {
    width: 222,
    height: 222,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
    borderWidth: 1,
    borderColor: 'rgba(47, 128, 255, 0.12)',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.16,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  logoStage: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    position: 'absolute',
    left: 28,
    top: 88,
    width: 74,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(47, 128, 255, 0.18)',
    transform: [{ rotate: '-18deg' }],
  },
  routeNodeStart: {
    position: 'absolute',
    left: 18,
    top: 96,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#5AA9FF',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  routeNodeEnd: {
    position: 'absolute',
    right: 18,
    top: 92,
    width: 14,
    height: 14,
    borderRadius: 14,
    backgroundColor: '#EAF2FF',
    borderWidth: 4,
    borderColor: '#5AA9FF',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  motionGroup: {
    position: 'absolute',
    right: 14,
    top: 86,
    gap: 6,
    alignItems: 'flex-end',
  },
  motionLineStrong: {
    width: 28,
    height: 3,
    borderRadius: 99,
    backgroundColor: '#2F80FF',
  },
  motionLineMedium: {
    width: 18,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(47, 128, 255, 0.58)',
  },
  motionLineSoft: {
    width: 10,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(47, 128, 255, 0.34)',
  },
  boxGlow: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: 'rgba(47, 128, 255, 0.10)',
    transform: [{ translateY: 14 }, { translateX: 5 }],
  },
  boxCore: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: '#2F80FF',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  boxTop: {
    position: 'absolute',
    width: 86,
    height: 34,
    top: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  boxCutLeft: {
    position: 'absolute',
    left: 18,
    top: 24,
    width: 20,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    transform: [{ rotate: '-28deg' }],
  },
  boxCutRight: {
    position: 'absolute',
    right: 18,
    top: 24,
    width: 20,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    transform: [{ rotate: '28deg' }],
  },
  pinBody: {
    position: 'absolute',
    right: 10,
    top: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5AA9FF',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  pinHole: {
    position: 'absolute',
    right: 21,
    top: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  pinTail: {
    position: 'absolute',
    right: 20,
    top: 19,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#5AA9FF',
    transform: [{ rotate: '45deg' }],
  },
  packageLine: {
    position: 'absolute',
    bottom: 22,
    left: 18,
    width: 48,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.44)',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
  },
  featureCard: {
    minWidth: 104,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    borderWidth: 1,
    borderColor: 'rgba(26, 35, 51, 0.05)',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  featureCardAccent: {
    minWidth: 118,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(47, 128, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(47, 128, 255, 0.10)',
    shadowColor: '#2F80FF',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  featureValue: {
    color: '#1A2333',
    fontFamily: displayFont,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  featureValueAccent: {
    color: '#2F80FF',
    fontFamily: displayFont,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  featureLabel: {
    marginTop: 4,
    color: '#8B96A5',
    fontFamily: displayFont,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  featureLabelAccent: {
    marginTop: 4,
    color: '#5A6C83',
    fontFamily: displayFont,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  copyBlock: {
    alignItems: 'center',
  },
  appName: {
    color: '#1A2333',
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1.1,
    fontFamily: displayFont,
  },
  tagline: {
    marginTop: 10,
    color: '#8B96A5',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: displayFont,
  },
  bottomArea: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  loaderShell: {
    width: '100%',
    maxWidth: 240,
    marginBottom: 14,
  },
  loaderTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(47, 128, 255, 0.10)',
    overflow: 'hidden',
  },
  loaderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '68%',
    borderRadius: 999,
    backgroundColor: '#2F80FF',
  },
  loaderShine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 72,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    opacity: 0.9,
  },
  footerText: {
    color: '#8B96A5',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 0.6,
    fontFamily: displayFont,
  },
});