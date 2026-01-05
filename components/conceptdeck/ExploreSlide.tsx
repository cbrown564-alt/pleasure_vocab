import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';
import { colors, shadows, spacing, typography } from '@/constants/theme';
import { ConceptSlide } from '@/types';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ExploreSlideProps {
    item: ConceptSlide;
    onFinish: () => void;
    isLast: boolean;
}

export const ExploreSlide = ({ item, onFinish, isLast }: ExploreSlideProps) => {
    return (
        <View style={styles.container}>

            {/* Main Content Centered Vertically */}
            <View style={styles.content}>

                {/* Icon with "Blob" background for weight */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.iconWrapper}>
                    <View style={styles.iconBackground} />
                    <Image
                        source={require('@/assets/images/ui/slide-explore.png')}
                        style={styles.icon}
                    />
                </Animated.View>

                {/* Title */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <Text variant="h2" align="center" style={styles.title}>
                        {item.title || 'Explore'}
                    </Text>
                </Animated.View>

                {/* Body Text */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.bodyContainer}>
                    <Text align="center" style={styles.bodyText}>
                        {item.content}
                    </Text>
                </Animated.View>

            </View>

            {/* Bottom Actions - Floating/Anchored */}
            {isLast && (
                <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.bottomContainer}>
                    <Button
                        title="Collect this Word"
                        onPress={onFinish}
                        variant="primary"
                        size="lg"
                        fullWidth
                        style={styles.button}
                    />
                    <Text variant="caption" align="center" color={colors.text.tertiary} style={styles.subButtonText}>
                        Add to your vocabulary
                    </Text>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        flex: 1,
        paddingHorizontal: spacing.xl,
        backgroundColor: '#F5F9F6', // Very light mint/sage tint
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60, // visual balance
    },
    iconWrapper: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconBackground: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.background.surface,
        opacity: 0.6,
    },
    icon: {
        width: 64,
        height: 64,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 32,
        color: colors.text.primary,
        marginBottom: spacing.lg,
        fontFamily: typography.fontFamily.heading,
    },
    bodyContainer: {
        marginBottom: spacing['3xl'], // More space below text
        paddingHorizontal: spacing.sm,
    },
    bodyText: {
        fontSize: 22,
        lineHeight: 34,
        color: colors.text.primary,
    },
    bottomContainer: {
        width: '100%',
        paddingBottom: 50, // Safe area / bottom spacing
    },
    button: {
        ...shadows.md,
    },
    subButtonText: {
        marginTop: 12,
        opacity: 0.8,
    }
});
