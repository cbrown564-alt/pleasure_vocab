import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface PulseHeartProps {
    size?: number;
    color?: string;
    active?: boolean;
}

export const PulseHeart = ({
    size = 24,
    color = colors.primary[500],
    active = false
}: PulseHeartProps) => {
    const scale = useSharedValue(1);
    const ringScale = useSharedValue(1);
    const ringOpacity = useSharedValue(0);

    useEffect(() => {
        if (active) {
            // Heart Pop
            scale.value = withSequence(
                withSpring(1.5, { damping: 10, stiffness: 200 }),
                withSpring(1, { damping: 10, stiffness: 200 })
            );

            // Ring Burst
            ringScale.value = 1;
            ringOpacity.value = 0.5;

            ringScale.value = withTiming(2.5, { duration: 600, easing: Easing.out(Easing.ease) });
            ringOpacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
        }
    }, [active]);

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: ringOpacity.value,
    }));

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={[styles.ring, ringStyle, {
                borderColor: color,
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2
            }]} />
            <Animated.View style={[{ justifyContent: 'center', alignItems: 'center' }, heartStyle]}>
                <Ionicons name={active ? "heart" : "heart-outline"} size={size} color={color} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
