import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

export interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  isPassword,
  error,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const containerStyle = useAnimatedStyle(() => {
    const borderColor = withTiming(
      error ? '#FF4C4C' : isFocused ? 'rgba(166,198,63,0.6)' : 'rgba(255,255,255,0.05)',
      { duration: 250 }
    );
    
    // Soft, diffused premium glow
    const shadowOpacity = withTiming(
      isFocused ? 0.8 : 0,
      { duration: 300 }
    );

    const backgroundColor = withTiming(
      isFocused ? 'rgba(10, 12, 10, 0.9)' : 'rgba(15, 18, 16, 0.4)',
      { duration: 250 }
    );

    return {
      borderColor,
      backgroundColor,
      shadowOpacity,
      shadowColor: error ? 'rgba(255,76,76,0.3)' : 'rgba(166,198,63,0.25)',
    };
  }, [isFocused, error]);

  const labelStyle = useAnimatedStyle(() => {
    const color = withTiming(
      error ? '#FF4C4C' : isFocused ? '#A6C63F' : '#B7B7B7',
      { duration: 250 }
    );
    return { color };
  }, [isFocused, error]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
      
      <Animated.View style={[styles.inputContainer, containerStyle]}>
        {icon && (
          <Feather 
            name={icon} 
            size={20} 
            color={isFocused ? '#A6C63F' : '#8B938B'} 
            style={styles.icon} 
          />
        )}
        
        <TextInput
          style={[styles.input, { paddingLeft: icon ? 0 : 20 }]}
          placeholderTextColor="#5A635A"
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {isPassword && (
          <Pressable 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={isFocused ? '#A6C63F' : '#8B938B'} 
            />
          </Pressable>
        )}
      </Animated.View>

      {error ? (
        <Animated.Text entering={withTiming(1)} style={styles.errorText}>
          {error}
        </Animated.Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    height: 64,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eyeIcon: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    color: '#FF4C4C',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '600',
  },
});
