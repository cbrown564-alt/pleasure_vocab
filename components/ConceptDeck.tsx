import { borderRadius, colors, shadows, spacing, typography } from '@/constants/theme';
import { useUserConcepts } from '@/hooks/useDatabase';
import { Concept, ConceptSlide, ConceptStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

import { ExploreSlide } from './conceptdeck/ExploreSlide';
import { IllustrateSlide } from './conceptdeck/IllustrateSlide';
import { NameSlide } from './conceptdeck/NameSlide';
import { RecognizeSlide } from './conceptdeck/RecognizeSlide';
import { ReflectSlide } from './conceptdeck/ReflectSlide';
import { UnderstandSlide } from './conceptdeck/UnderstandSlide';

const Slide = ({
    item,
    concept,
    onFinish,
    isLast,
    onSetStatus,
    currentStatus,
    savingStatus,
    feedbackMessage,
}: {
    item: ConceptSlide,
    concept: Concept,
    onFinish: () => void,
    isLast: boolean,
    onSetStatus: (status: ConceptStatus) => Promise<void>,
    currentStatus: ConceptStatus,
    savingStatus: ConceptStatus | null,
    feedbackMessage?: string | null
}) => {
    switch (item.type) {
        case 'recognize':
            return <RecognizeSlide item={item} concept={concept} />;
        case 'name':
            return <NameSlide item={item} concept={concept} />;
        case 'illustrate':
            return <IllustrateSlide item={item} />;
        case 'understand':
            return <UnderstandSlide item={item} />;
        case 'explore':
        case 'explore':
            return (
                <ExploreSlide
                    item={item}
                />
            );
        case 'reflect':
            return (
                <ReflectSlide
                    item={item}
                    onFinish={onFinish}
                    onSetStatus={onSetStatus}
                    currentStatus={currentStatus}
                    savingStatus={savingStatus}
                />
            );
        default:
    }
};

export const ConceptDeck = ({ concept }: { concept: Concept }) => {
    const router = useRouter();
    const { setStatus, getStatus, masterConcept } = useUserConcepts();
    const [activeIndex, setActiveIndex] = useState(0);
    const [savingStatus, setSavingStatus] = useState<ConceptStatus | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<ConceptStatus>('unexplored');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const flatListRef = React.useRef<FlatList>(null);

    useEffect(() => {
        setSelectedStatus(getStatus(concept.id));
    }, [concept.id, getStatus]);



    const handleStatusSelection = async (status: ConceptStatus) => {
        try {
            setSavingStatus(status);
            await setStatus(concept.id, status);
            if (status !== 'unexplored') {
                await masterConcept(concept.id);
            }
            setSelectedStatus(status);
            // Silent update - no toast
        } catch (error) {
            console.error('Failed to update status', error);
            Alert.alert('Could not save', 'Please try selecting a status again.');
        } finally {
            setSavingStatus(null);
        }
    };

    const onFinish = async () => {
        if (selectedStatus === 'unexplored') {
            await handleStatusSelection('explored');
        }
        router.back();
    };

    // Construct slides if not present (legacy fallback)
    let slides: ConceptSlide[] = concept.slides || [
        { type: 'recognize', content: concept.recognitionPrompts[0] || 'Have you experienced this?' },
        { type: 'name', content: concept.definition },
        { type: 'understand', content: concept.researchBasis },
        { type: 'explore', content: concept.recognitionPrompts[1] || 'Try noticing this next time.' }
    ];

    // Ensure Reflect slide exists at the end
    if (slides[slides.length - 1].type !== 'reflect') {
        slides = [...slides, { type: 'reflect', content: 'Reflection', title: 'Reflection' }];
    }



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
                renderItem={({ item, index }) => (
                    <Slide
                        item={item}
                        concept={concept}
                        onFinish={onFinish}
                        isLast={index === slides.length - 1}
                        onSetStatus={handleStatusSelection}
                        currentStatus={selectedStatus}
                        savingStatus={savingStatus}
                        feedbackMessage={feedbackMessage}
                    />
                )}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ref={flatListRef}
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

    // Recognize slide
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
    recognizeCard: {
        marginBottom: spacing.xl * 2,
    },
    recognizeText: {
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

    // Name slide
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    nameTitle: {
        fontSize: 28,
        color: colors.primary[800],
        marginBottom: spacing.lg,
    },
    nameBody: {
        fontSize: 20,
        lineHeight: 32,
        color: colors.text.primary,
    },

    // Understand slide (Evidence/Research)
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
        fontFamily: typography.fontFamily.headingItalic,
    },

    // Explore slide (Action/Final)
    slideTitle: {
        fontSize: 32,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    sparkleContainer: {
        marginBottom: spacing.md,
    },
    exploreCard: {
        marginBottom: 40,
        justifyContent: 'center',
        paddingHorizontal: spacing.sm,
    },
    exploreText: {
        fontSize: 24,
        lineHeight: 38,
        color: colors.text.primary,
    },
    actionContainer: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    collectButton: {
        ...shadows.md,
    },

    // Diagram placeholder (for future use)
    diagramContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    diagramPlaceholder: {
        alignItems: 'center',
    },

    // Fallback
    BodyCentered: {
        fontSize: 21,
        lineHeight: 34,
        color: colors.text.secondary,
        textAlign: 'center',
    }
});
