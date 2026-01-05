import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { Concept, ConceptSlide } from '@/types';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface NameSlideProps {
    item: ConceptSlide;
    concept: Concept;
}

export const NameSlide = ({ item, concept }: NameSlideProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {/* Icon */}
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.iconContainer}>
                    <Image
                        source={require('@/assets/images/ui/slide-name.png')}
                        style={styles.icon}
                    />
                </Animated.View>

                {/* Title */}
                <Animated.View entering={FadeInUp.delay(300).springify()}>
                    <Text
                        variant="h2"
                        align="center"
                        style={styles.title}
                    >
                        {item.title || 'The Word'}
                    </Text>
                </Animated.View>

                {/* Definition Body */}
                <Animated.View entering={FadeIn.delay(500).duration(800)} style={styles.bodyContainer}>
                    <Text
                        variant="body"
                        align="center"
                        style={styles.bodyText}
                    >
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
        backgroundColor: colors.primary[50], // Light Blush background
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        // tintColor removed to prevent coloring background
    },
    title: {
        fontSize: 28,
        color: colors.primary[800],
        marginBottom: spacing.xl,
        fontFamily: typography.fontFamily.heading,
    },
    bodyContainer: {
        maxWidth: '90%',
        padding: spacing.lg,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderRadius: borderRadius.lg,
    },
    bodyText: {
        fontSize: 20,
        lineHeight: 32,
        color: colors.text.primary,
    },
});
