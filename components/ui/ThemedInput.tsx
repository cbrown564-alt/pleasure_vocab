import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface ThemedInputProps extends TextInputProps {
    error?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

export function ThemedInput({ style, containerStyle, error, onFocus, onBlur, ...props }: ThemedInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={[
            styles.container,
            isFocused && styles.focused,
            error && styles.error,
            containerStyle
        ]}>
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={colors.text.tertiary}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm, // Compact vertical padding, let TextInput handle height
        ...shadows.sm,
    },
    focused: {
        borderColor: colors.primary[500],
        ...shadows.md,
    },
    error: {
        borderColor: colors.error,
    },
    input: {
        fontFamily: typography.fontFamily.body,
        fontSize: 16,
        color: colors.text.primary,
        minHeight: 24, // Ensure distinct height
    },
});
