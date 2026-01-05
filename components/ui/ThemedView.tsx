import { colors } from '@/constants/theme';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
    colorKey?: keyof typeof colors.background;
}

export function ThemedView({ style, colorKey = 'primary', ...props }: ThemedViewProps) {
    const backgroundColor = colors.background[colorKey];

    return <View style={[{ backgroundColor }, style]} {...props} />;
}
