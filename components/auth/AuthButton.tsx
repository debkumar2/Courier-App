import React from 'react';
import { StyleSheet, Text, ActivityIndicator, Pressable, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  const handlePressIn = () => {
    if (!disabled && !isLoading) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !isLoading) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[styles.container, style]}
    >
      <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
        
        {/* Soft elegant neon glow underneath */}
        <Animated.View style={styles.glowContainer}>
          <LinearGradient
            colors={['rgba(166,198,63,0.8)', 'rgba(188,214,122,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glow}
          />
        </Animated.View>

        <LinearGradient
          colors={['#BCD67A', '#A6C63F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Inner Highlight for 3D depth */}
          <View style={styles.innerHighlight} />

          {isLoading ? (
            <ActivityIndicator color="#050606" size="small" />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    height: 64,
    borderRadius: 24,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    shadowColor: '#A6C63F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  glow: {
    flex: 1,
    borderRadius: 24,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    color: '#050606',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
