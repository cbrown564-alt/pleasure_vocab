import { textStyles } from '@/constants/theme';
import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

type TextVariant = keyof typeof textStyles | 'bodySmall' | 'labelSmall';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
}

export function Text({
  children,
  variant = 'body',
  color,
  align,
  style,
  numberOfLines,
}: TextProps) {

  // Cast textStyles to any to allow dynamic access with fallback handling
  let variantStyle: TextStyle = (textStyles as any)[variant];

  // Fallback mappings if strict key missing
  if (variant === 'bodySmall') {
    variantStyle = textStyles.caption;
  }
  if (variant === 'labelSmall') {
    variantStyle = { ...textStyles.label, fontSize: 10, letterSpacing: 1 };
  }

  return (
    <RNText
      style={[
        variantStyle,
        color && { color },
        align && { textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
