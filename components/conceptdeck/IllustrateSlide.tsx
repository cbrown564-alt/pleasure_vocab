import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { ConceptSlide } from '@/types';
import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface IllustrateSlideProps {
    item: ConceptSlide;
}

export const IllustrateSlide = ({ item }: IllustrateSlideProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {/* Illustration (Video or Image) */}
                {item.illustrationVideo ? (
                    <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.illustrationContainer}>
                        <Video
                            source={item.illustrationVideo}
                            style={styles.illustration}
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            isLooping
                            isMuted
                        />
                    </Animated.View>
                ) : item.illustrationAsset ? (
                    <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.illustrationContainer}>
                        <Image
                            source={item.illustrationAsset}
                            style={styles.illustration}
                            resizeMode="contain"
                        />
                    </Animated.View>
                ) : null}

                {/* Caption */}
                {item.illustrationCaption && (
                    <Animated.View entering={FadeIn.delay(500).duration(600)} style={styles.captionContainer}>
                        <Text
                            variant="caption"
                            align="center"
                            color={colors.text.tertiary}
                            style={styles.caption}
                        >
                            {item.illustrationCaption}
                        </Text>
                    </Animated.View>
                )}

                {/* Content text (if provided) */}
                {item.content && (
                    <Animated.View entering={FadeIn.delay(600).duration(600)} style={styles.textContainer}>
                        <Text
                            align="center"
                            style={styles.text}
                        >
                            {item.content}
                        </Text>
                    </Animated.View>
                )}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 80,
        paddingBottom: 60,
        backgroundColor: colors.background.primary, // Clean cream
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        width: '100%',
        aspectRatio: 1, // Square by default, image will fit within
        maxHeight: '60%',
        marginBottom: spacing.xl,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: colors.background.surface,
        ...shadows.sm,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    captionContainer: {
        marginBottom: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    caption: {
        fontStyle: 'italic',
    },
    textContainer: {
        paddingHorizontal: spacing.md,
    },
    text: {
        fontSize: 18,
        lineHeight: 28,
        color: colors.text.secondary,
    },
});
