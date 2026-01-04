import { Button } from '@/components/ui/Button';
import { Text as ThemedText } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { useUserProgress } from '@/lib/user-store';
import { Concept, ConceptSlide, DiagramType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Helper to get icons for slide types
const getSlideIcon = (type: string) => {
    switch (type) {
        case 'context': return 'bulb-outline';
        case 'deep_dive': return 'library-outline';
        case 'reflection': return 'sparkles-outline';
        default: return 'book-outline';
    }
};

// Placeholder for Interactive Diagrams
const DiagramPlaceholder = ({ type }: { type: DiagramType }) => {
    return (
        <View style={styles.diagramContainer}>
            <View style={styles.diagramPlaceholder}>
                <Ionicons name="images-outline" size={48} color={colors.neutral[300]} />
                <ThemedText variant="body" color={colors.text.tertiary} style={{ marginTop: 12 }}>
                    Interactive Diagram: {type}
                </ThemedText>
            </View>
        </View>
    );
};

const Slide = ({ item, concept, onFinish }: { item: ConceptSlide, concept: Concept, onFinish: () => void }) => {
    const { type, title, content, image } = item;

    // COVER SLIDE
    if (type === 'cover') {
        return (
            <View style={styles.slide}>
                <View style={[styles.centeredContent]}>
                    <ThemedText variant="label" color={colors.text.tertiary} align="center" style={styles.categoryLabel}>
                        {concept.category.toUpperCase()}
                    </ThemedText>

                    <ThemedText variant="h1" align="center" style={styles.heroTitle}>{concept.name}</ThemedText>

                    <View style={styles.definitionCard}>
                        <ThemedText variant="h3" align="center" style={styles.definitionText}>
                            {content}
                        </ThemedText>
                    </View>

                    <View style={styles.heroFooter}>
                        <ThemedText variant="caption" color={colors.text.tertiary}>Swipe to learn</ThemedText>
                        <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
                    </View>
                </View>
            </View>
        );
    }

    // CONTEXT SLIDE ("The Why") - Clean Editorial, slightly warmer
    if (type === 'context') {
        return (
            <View style={[styles.slide, { backgroundColor: colors.primary[50] }]}>
                <View style={styles.centeredContent}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="bulb-outline" size={28} color={colors.primary[600]} />
                    </View>

                    <ThemedText variant="h2" align="center" style={styles.contextTitle}>{title || 'The Why'}</ThemedText>

                    <View style={{ maxWidth: '90%' }}>
                        <ThemedText variant="body" align="center" style={styles.contextBody}>
                            {content}
                        </ThemedText>
                    </View>
                </View>
            </View>
        );
    }

    // DEEP DIVE / EVIDENCE ("Research Card") - Card look
    if (type === 'deep_dive') {
        return (
            <View style={styles.slide}>
                <View style={styles.centeredContent}>
                    <ThemedText variant="h4" align="center" color={colors.text.tertiary} style={{ marginBottom: spacing.lg }}>
                        THE EVIDENCE
                    </ThemedText>

                    <View style={styles.evidenceCard}>
                        <Ionicons name="quote" size={32} color={colors.primary[200]} style={styles.quoteIcon} />
                        <ThemedText variant="h3" style={styles.evidenceText}>
                            {content}
                        </ThemedText>
                        <View style={styles.evidenceFooter}>
                            <ThemedText variant="caption" color={colors.text.tertiary}>Research Basis</ThemedText>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    // VISUAL SLIDE ("Dark Mode" / Visual focus)
    if (type === 'visual') {
        return (
            <View style={styles.slide}>
                <View style={styles.centeredContent}>
                    <ThemedText variant="h2" align="center" style={styles.slideTitle}>{title || 'See it in action'}</ThemedText>

                    <ThemedText variant="body" align="center" style={styles.visualBody}>{content}</ThemedText>

                    <View style={styles.visualContainer}>
                        {concept.diagramType ? (
                            <DiagramPlaceholder type={concept.diagramType} />
                        ) : image ? (
                            <Image source={image} style={styles.image} resizeMode="contain" />
                        ) : null}
                    </View>
                </View>
            </View>
        );
    }

    // FINAL / REFLECTION SLIDE (Actionable)
    if (type === 'reflection') {
        return (
            <View style={styles.slide}>
                <View style={styles.centeredContent}>
                    <View style={styles.sparkleContainer}>
                        <Ionicons name="sparkles" size={40} color={colors.primary[500]} />
                    </View>

                    <ThemedText variant="h2" align="center" style={styles.slideTitle}>{title || 'Try This'}</ThemedText>

                    <View style={styles.reflectionCard}>
                        <ThemedText variant="h3" align="center" style={styles.reflectionText}>{content}</ThemedText>
                    </View>

                    <View style={styles.actionContainer}>
                        <Button
                            title="Collect this Word"
                            onPress={onFinish}
                            variant="primary"
                            size="lg"
                            fullWidth
                            style={styles.collectButton}
                        />
                        <ThemedText variant="caption" align="center" color={colors.text.tertiary} style={{ marginTop: 12 }}>
                            Add to your library to track mastery
                        </ThemedText>
                    </View>
                </View>
            </View>
        );
    }

    // Fallback
    return (
        <View style={styles.slide}>
            <View style={styles.centeredContent}>
                <ThemedText variant="h2" align="center" style={styles.slideTitle}>{title || type.toUpperCase()}</ThemedText>
                <ThemedText variant="body" align="center" style={styles.BodyCentered}>{content}</ThemedText>
            </View>
        </View>
    );
};

export const ConceptDeck = ({ concept }: { concept: Concept }) => {
    const router = useRouter();
    const { masterConcept } = useUserProgress();
    const [activeIndex, setActiveIndex] = useState(0);

    const onFinish = async () => {
        await masterConcept(concept.id);
        router.back();
    };

    // Construct slides if not present (legacy fallback)
    const slides: ConceptSlide[] = concept.slides || [
        { type: 'cover', content: concept.definition },
        { type: 'context', title: 'The Why', content: concept.description },
        { type: 'deep_dive', title: 'The Evidence', content: concept.researchBasis },
        { type: 'visual', title: 'Visualize It', content: 'Visual representation placeholder.' },
        { type: 'reflection', title: 'Try This', content: concept.recognitionPrompts[0] || 'Have you noticed this?' }
    ];

    const handleScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    };

    return (
        <View style={styles.container}>
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.track}>
                    {slides.map((_, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.progressDot,
                                idx === activeIndex && styles.progressDotActive,
                                idx < activeIndex && styles.progressDotVisited
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text.tertiary} onPress={() => router.back()} />
            </View>

            <FlatList
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => <Slide item={item} concept={concept} onFinish={onFinish} />}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    progressBarContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    track: {
        flexDirection: 'row',
        gap: 6,
    },
    progressDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.neutral[200],
    },
    progressDotActive: {
        backgroundColor: colors.primary[500],
        width: 16,
    },
    progressDotVisited: {
        backgroundColor: colors.primary[300],
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 20,
        padding: 8,
    },

    // Slide Layout
    slide: {
        width: width,
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: 100, // Space for progress bar
        paddingBottom: 60,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // TYPOGRAPHY & COMPONENTS

    // Cover
    categoryLabel: {
        letterSpacing: 2,
        marginBottom: spacing.sm,
        fontSize: 12,
    },
    heroTitle: {
        fontSize: 42,
        marginBottom: spacing.xl,
        lineHeight: 48,
    },
    definitionCard: {
        marginBottom: spacing.xl * 2,
    },
    definitionText: {
        fontSize: 22,
        lineHeight: 34,
        fontStyle: 'italic',
        color: colors.text.secondary,
    },
    heroFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.xs,
        opacity: 0.6,
        marginTop: 20
    },

    // Context ("The Why")
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    contextTitle: {
        fontSize: 28,
        color: colors.primary[800],
        marginBottom: spacing.lg,
    },
    contextBody: {
        fontSize: 20,
        lineHeight: 32,
        color: colors.text.primary,
    },

    // Evidence ("Research Card")
    evidenceCard: {
        backgroundColor: colors.background.surface,
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        width: '100%',
        ...shadows.md,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[300],
    },
    quoteIcon: {
        marginBottom: spacing.md,
        opacity: 0.8,
    },
    evidenceText: {
        fontSize: 20,
        lineHeight: 30,
        color: colors.text.secondary,
        fontFamily: typography.fontFamily.headingItalic, // Quote feel
        marginBottom: spacing.md,
    },
    evidenceFooter: {
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
        paddingTop: spacing.md,
        alignItems: 'flex-start',
    },

    // Visual
    slideTitle: {
        fontSize: 32,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    visualBody: {
        fontSize: 18,
        lineHeight: 28,
        color: colors.text.secondary,
        marginBottom: spacing.lg,
    },
    visualContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        width: '100%',
        backgroundColor: colors.background.surface,
        borderRadius: 24,
        ...shadows.lg,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    diagramContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    diagramPlaceholder: {
        alignItems: 'center',
    },

    // Reflection / Final
    sparkleContainer: {
        marginBottom: spacing.md,
    },
    reflectionCard: {
        marginBottom: 40,
        justifyContent: 'center',
        paddingHorizontal: spacing.sm,
    },
    reflectionText: {
        fontSize: 26,
        lineHeight: 40,
        color: colors.text.primary,
    },
    actionContainer: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    collectButton: {
        ...shadows.md,
    },

    // Fallback
    BodyCentered: {
        fontSize: 21,
        lineHeight: 34,
        color: colors.text.secondary,
        textAlign: 'center',
    }
});
