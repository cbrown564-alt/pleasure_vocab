import { Text } from '@/components/ui/Typography';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';
import { ConceptSlide, ConceptStatus } from '@/types';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ReflectSlideProps {
    item: ConceptSlide;
    onFinish: () => void;
    onSetStatus: (status: ConceptStatus) => void;
    currentStatus: ConceptStatus;
    savingStatus: ConceptStatus | null;
}

export const ReflectSlide = ({ onFinish, onSetStatus, currentStatus, savingStatus }: ReflectSlideProps) => {

    const handleSelect = (status: ConceptStatus) => {
        onSetStatus(status);
        // UX: Small delay to show selection, then finish
        setTimeout(() => {
            onFinish();
        }, 300);
    };

    const statusOptions: { status: ConceptStatus; label: string; helper: string }[] = [
        { status: 'resonates', label: 'Resonates', helper: 'This lands for me' },
        { status: 'curious', label: 'Curious to explore', helper: 'I want to try this' },
        { status: 'not_for_me', label: 'Not interested', helper: 'Skip this one' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Text variant="h2" align="center" style={styles.title}>
                        How does this land for you?
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.cardsContainer}>
                    {statusOptions.map((option, index) => {
                        const isSelected = currentStatus === option.status;
                        return (
                            <TouchableOpacity
                                key={option.status}
                                style={[
                                    styles.card,
                                    isSelected && styles.cardSelected
                                ]}
                                onPress={() => handleSelect(option.status)}
                                disabled={savingStatus !== null}
                                activeOpacity={0.7}
                            >
                                <View style={styles.cardHeader}>
                                    <Text variant="label" color={isSelected ? colors.primary[700] : colors.text.primary} style={styles.optionLabel}>
                                        {option.label}
                                    </Text>
                                    {isSelected && <Text variant="caption" color={colors.primary[600]}>✓</Text>}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
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
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 60,
    },
    title: {
        fontSize: 32,
        marginBottom: spacing['3xl'],
        color: colors.text.primary,
    },
    cardsContainer: {
        gap: spacing.lg,
        width: '100%',
        marginBottom: spacing['3xl'],
    },
    card: {
        backgroundColor: colors.background.surface,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardSelected: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[50], // Very subtle tint
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '600',
    }
});
