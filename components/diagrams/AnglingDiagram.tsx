import { colors, textStyles } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Circle,
    Group,
    Path,
    Skia
} from '@shopify/react-native-skia';
import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue
} from 'react-native-reanimated';

export const AnglingDiagram = () => {
    const { width } = useWindowDimensions();
    const CANVAS_WIDTH = width - 40;
    const CANVAS_HEIGHT = 300;

    // --- Logic & State ---
    const angle = useSharedValue(0);
    const startAngle = useSharedValue(0);
    const [feedback, setFeedback] = React.useState('Neutral');

    const pan = Gesture.Pan()
        .onStart(() => {
            startAngle.value = angle.value;
        })
        .onUpdate((e) => {
            // Dragging DOWN = Posterior Tilt (tuck) = Negative angle
            const delta = -e.translationY / 5;
            angle.value = Math.max(-20, Math.min(20, startAngle.value + delta));
        })
        .onEnd(() => {
            // Optional: snap logic could go here
        });

    // --- Derived Visuals ---
    const transform = useDerivedValue(() => {
        return [{ rotate: angle.value * (Math.PI / 180) }]; // Skia uses radians for some transforms, but Matrix uses deg? 
        // Actually rendering logic: group transform property expects object similar to RN styles
        // But Skia 'transform' prop on Group usually takes a generic transform list.
    });

    // Using simple derived transform for Skia Group
    const groupTransform = useDerivedValue(() => {
        return [{ rotate: angle.value * (Math.PI / 180) }]; // Group transform prop takes radians usually?
        // Wait, Skia's <Group transform={...}> uses Skia's transform format.
        // Let's use origin + transform to rotate around pivot.
    });

    const glowColor = useDerivedValue(() => {
        // "Sweet spot" at posterior tilt (-10 to -20)
        return interpolateColor(
            angle.value,
            [-20, -10, 0, 20],
            [colors.primary[500], colors.primary[500], colors.neutral[300], colors.neutral[300]]
        );
    });

    const glowOpacity = useDerivedValue(() => {
        return interpolate(angle.value, [-15, 0], [1, 0], 'clamp');
    });

    const strokeWidth = useDerivedValue(() => {
        return interpolate(angle.value, [-15, 0], [8, 4], 'clamp');
    });

    useAnimatedReaction(
        () => angle.value,
        (curr, prev) => {
            if (curr !== prev) {
                let text = 'Neutral';
                if (curr > 5) text = 'Anterior Tilt (Arch)';
                if (curr < -5) text = 'Posterior Tilt (Tuck)';
                runOnJS(setFeedback)(text);
            }
        }
    );

    // --- Paths ---
    const spinePath = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(150, 40);
        p.quadTo(150, 100, 150, 130);
        return p;
    }, []);

    const pelvisPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        // M90 130 Q150 200 210 130 L200 130 Q150 180 100 130 Z
        p.moveTo(90, 130);
        p.quadTo(150, 200, 210, 130);
        p.lineTo(200, 130);
        p.quadTo(150, 180, 100, 130);
        p.close();
        return p;
    }, []);

    const contactZonePath = React.useMemo(() => {
        const p = Skia.Path.Make();
        // M130 150 Q150 170 170 150
        p.moveTo(130, 150);
        p.quadTo(150, 170, 170, 150);
        return p;
    }, []);

    const PIVOT_X = 150;
    const PIVOT_Y = 130;

    return (
        <View style={{ alignItems: 'center' }}>
            {/* Instruction Overlay */}
            <View style={{ position: 'absolute', top: 10, zIndex: 10, alignItems: 'center' }}>
                <Text style={[textStyles.label, { color: colors.text.secondary }]}>
                    {feedback}
                </Text>
            </View>

            <GestureDetector gesture={pan}>
                <View style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, overflow: 'hidden', backgroundColor: colors.neutral[50], borderRadius: 12 }}>
                    <Canvas style={{ flex: 1 }}>
                        {/* 1. Spine (Static) */}
                        <Path path={spinePath} style="stroke" strokeWidth={4} color={colors.neutral[300]} strokeCap="round" />

                        {/* 2. Pelvis Group (Rotates) */}
                        <Group
                            origin={{ x: PIVOT_X, y: PIVOT_Y }}
                            transform={groupTransform}
                        >
                            {/* Pelvis Shape */}
                            <Path path={pelvisPath} color={colors.neutral[100]} />
                            <Path path={pelvisPath} style="stroke" strokeWidth={2} color={colors.neutral[400]} />

                            {/* Contact Zone - Base */}
                            <Path path={contactZonePath} style="stroke" strokeWidth={4} color={colors.neutral[300]} strokeCap="round" />

                            {/* Contact Zone - Glow Overlay (Sweet Spot) */}
                            <Path
                                path={contactZonePath}
                                style="stroke"
                                strokeWidth={strokeWidth}
                                color={glowColor}
                                strokeCap="round"
                                opacity={glowOpacity}
                            >
                                <BlurMask blur={4} style="normal" />
                            </Path>
                        </Group>

                        {/* Pivot Point */}
                        <Circle cx={PIVOT_X} cy={PIVOT_Y} r={4} color={colors.secondary[500]} opacity={0.5} />
                    </Canvas>
                </View>
            </GestureDetector>

            <Text style={[textStyles.caption, { marginTop: 10, color: colors.text.tertiary }]}>
                Drag up/down to tilt
            </Text>
        </View>
    );
};
