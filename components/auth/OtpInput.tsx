import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Animated as RNAnimated, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const OtpBox = ({ 
  char, 
  isFocused,
  isFilled,
  isComplete,
  error,
  onPress
}: { 
  char: string, 
  isFocused: boolean, 
  isFilled: boolean,
  isComplete: boolean,
  error?: boolean,
  onPress: () => void 
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = withTiming(
      error ? '#FF4C4C' : isComplete ? '#A6C63F' : isFocused ? '#A6C63F' : 'rgba(255,255,255,0.1)',
      { duration: 250 }
    );
    
    const backgroundColor = withTiming(
      isComplete ? 'rgba(166,198,63,0.15)' : isFocused || isFilled ? 'rgba(20, 23, 20, 0.95)' : 'rgba(20, 23, 20, 0.6)',
      { duration: 250 }
    );

    const scale = withSpring(
      isFocused ? 1.05 : 1,
      { damping: 12, stiffness: 200 }
    );

    const shadowOpacity = withTiming(
      isFocused || isComplete ? 0.6 : 0,
      { duration: 300 }
    );

    return {
      borderColor,
      backgroundColor,
      transform: [{ scale }],
      shadowOpacity,
      shadowColor: error ? '#FF4C4C' : '#A6C63F',
      borderWidth: isFocused || isComplete ? 1.5 : 1,
    };
  }, [isFocused, isFilled, isComplete, error]);

  return (
    <Pressable onPress={onPress} style={styles.boxWrapper}>
      <Animated.View style={[styles.box, animatedStyle]}>
        <RNAnimated.Text style={[styles.char, isComplete && { color: '#A6C63F' }]}>{char}</RNAnimated.Text>
      </Animated.View>
    </Pressable>
  );
};

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  error = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleChangeText = (text: string) => {
    const formatted = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(formatted);
  };

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const isComplete = value.length === length;

  const boxes = Array.from({ length }, (_, i) => {
    const char = value[i] || '';
    const isFilled = char.length > 0;
    const isCurrentFocus = isFocused && value.length === i || (isFocused && value.length === length && i === length - 1);
    
    return (
      <OtpBox 
        key={i} 
        char={char} 
        isFocused={isCurrentFocus} 
        isFilled={isFilled}
        isComplete={isComplete}
        error={error} 
        onPress={handlePress} 
      />
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.boxesContainer}>
        {boxes}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={length}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.hiddenInput}
        caretHidden
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  boxWrapper: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 60,
  },
  box: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
  },
  char: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
