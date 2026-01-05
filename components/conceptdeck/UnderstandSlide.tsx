import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { ConceptSlide } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface UnderstandSlideProps {
    item: ConceptSlide;
}

export const UnderstandSlide = ({ item }: UnderstandSlideProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {/* Icon Top/Centered - Less "Forced" */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.iconContainer}>
                    <Image
                        source={require('@/assets/images/ui/slide-understand.png')}
                        style={styles.icon}
                    />
                </Animated.View>

                {/* Label */}
                <Animated.View entering={FadeIn.delay(300)}>
                    <Text
                        variant="label"
                        align="center"
                        color={colors.text.tertiary}
                        style={styles.header}
                    >
                        THE RESEARCH
                    </Text>
                </Animated.View>

                {/* Clean, Readable Card */}
                <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.card}>
                    {/* Subtle quote mark for "Evidence" feel */}
                    <Ionicons name="quote" size={24} color={colors.primary[200]} style={styles.quoteMark} />

                    <Text style={styles.text}>
                        {item.content}
                    </Text>
                </Animated.View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: 100,
        paddingBottom: 60,
        backgroundColor: colors.background.secondary, // Light "Paper" off-white
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.md,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.background.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    icon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
        opacity: 0.8
    },
    header: {
        marginBottom: spacing.xl,
        letterSpacing: 2,
    },
    card: {
        backgroundColor: colors.background.surface,
        padding: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing['2xl'],
        borderRadius: borderRadius.lg, // Soft rounded corners
        width: '100%',
        ...shadows.sm, // Softer shadow
        // Removed the heavy left border for a cleaner look
    },
    quoteMark: {
        marginBottom: spacing.sm,
        opacity: 0.6,
    },
    text: {
        fontSize: 20,
        lineHeight: 32, // Relaxed line height for readability
        color: colors.text.secondary,
        fontFamily: typography.fontFamily.body, // Switched to Body font for readability
        fontWeight: '400',
    },
});
