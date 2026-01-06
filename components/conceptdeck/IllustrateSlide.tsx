import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { ConceptSlide } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Audio, ResizeMode, Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AnglingDiagram } from '../diagrams/AnglingDiagram';
import { RockingDiagram } from '../diagrams/RockingDiagram';
import { ShallowingDiagram } from '../diagrams/ShallowingDiagram';
const { width } = Dimensions.get('window');

interface IllustrateSlideProps {
    item: ConceptSlide;
    isActive?: boolean;
    diagramType?: 'angling' | 'shallowing' | 'rocking' | 'pairing' | 'none';
}

export const IllustrateSlide = ({ item, isActive = false, diagramType }: IllustrateSlideProps) => {
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // Enable audio playback in silent mode
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
        });
    }, []);

    // Render content based on availability
    // Priority: 1. Interactive Diagram, 2. Video, 3. Static Image
    const renderContent = () => {
        // 1. Interactive Diagram
        if (diagramType === 'angling') {
            return (
                <View style={styles.diagramContainer}>
                    <AnglingDiagram />
                </View>
            );
        }
        if (diagramType === 'shallowing') {
            // Import dynamically or explicitly at top? Explicit is better.
            // But for now let's assume we import it.
            return (
                <View style={styles.diagramContainer}>
                    <ShallowingDiagram />
                </View>
            );
        }

        if (diagramType === 'rocking') {
            return (
                <View style={styles.diagramContainer}>
                    <RockingDiagram />
                </View>
            );
        }

        // 2. Video Illustration
        if (item.illustrationVideo) {
            return (
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.illustrationContainer}>
                    <Video
                        source={item.illustrationVideo}
                        style={styles.illustration}
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={isActive}
                        isLooping
                        isMuted={isMuted}
                    />
                    <TouchableOpacity
                        style={styles.muteButton}
                        onPress={() => setIsMuted(!isMuted)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isMuted ? "volume-mute" : "volume-high"}
                            size={20}
                            color={colors.text.primary}
                        />
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        // 3. Static Image
        if (item.illustrationAsset) {
            return (
                <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.illustrationContainer}>
                    <Image
                        source={item.illustrationAsset}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </Animated.View>
            );
        }

        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {renderContent()}

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

            </View >
        </View >
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
    diagramContainer: {
        width: '100%',
        aspectRatio: 1, // Keep square
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: colors.neutral[50],
        ...shadows.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    muteButton: {
        position: 'absolute',
        bottom: spacing.sm,
        right: spacing.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: spacing.xs,
        borderRadius: borderRadius.lg, // Fixed: round doesn't exist, using lg for circle effect
        ...shadows.sm,
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
