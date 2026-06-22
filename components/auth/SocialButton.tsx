import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, View } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  style?: ViewStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const isGoogle = provider === 'google';
  const title = isGoogle ? 'Continue with Google' : 'Continue with Apple';
  const iconName = isGoogle ? 'google' : 'apple';
  const iconColor = isGoogle ? '#DB4437' : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, style]}
    >
      <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
        <View style={styles.leftContent}>
          <FontAwesome5 name={iconName} size={20} color={iconColor} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#B7B7B7" />
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
    height: 60,
    backgroundColor: 'rgba(15, 18, 16, 0.75)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
