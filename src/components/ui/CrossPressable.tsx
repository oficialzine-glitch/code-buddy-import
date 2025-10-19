import React from 'react';
import { Platform, Pressable, GestureResponderEvent } from 'react-native';

type Props = { 
  onPress?: (e?: GestureResponderEvent) => void; 
  disabled?: boolean; 
  children: React.ReactNode; 
  style?: any; 
  testID?: string; 
  className?: string; 
  hitSlop?: number | { top?: number; left?: number; right?: number; bottom?: number }; 
};

export default function CrossPressable({ onPress, disabled, children, style, className, hitSlop = 8, ...rest }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        { opacity: disabled ? 0.6 : pressed ? 0.7 : 1, cursor: Platform.OS === 'web' ? (disabled ? 'default' : 'pointer') : undefined },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
