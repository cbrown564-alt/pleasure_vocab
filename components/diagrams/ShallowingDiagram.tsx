
import { colors, textStyles } from '@/constants/theme';
import {
    BlurMask,
    Canvas,
    Circle,
    Group,
    LinearGradient,
    Path,
    Rect,
    Skia,
    Turbulence,
    vec
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
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

// --- Geometry Constants ---
const CANVAS_HEIGHT = 300;
const CANAL_LENGTH = 280;
const ENTRANCE_X = 40;
export const ShallowingDiagram = () => {
    const { width } = useWindowDimensions();
    const CANVAS_WIDTH = width - 40; // Padding
    const CANVAS_HEIGHT = 300;
    const CANAL_LENGTH = 280;
    const ENTRANCE_X = 40;

    // --- Animation State ---
    // probeX: 0 = outside, ENTRANCE_X = entrance, 280 = deep
    const probeX = useSharedValue(ENTRANCE_X);
    const isInteracting = useSharedValue(0);
    const [feedback, setFeedback] = React.useState("Neutral");

    // --- Interaction ---
    const pan = Gesture.Pan()
        .onStart(() => {
            isInteracting.value = withSpring(1);
        })
        .onUpdate((e) => {
            // Allow dragging from slightly outside (-20) to full depth
            probeX.value = Math.max(0, Math.min(CANAL_LENGTH, e.x));
        })
        .onEnd(() => {
            isInteracting.value = withSpring(0);
        });

    // --- Derived Values ---
    // Intensity is highest at the entrance (ENTRANCE_X +/- 20)
    const intensity = useDerivedValue(() => {
        // Peak at ENTRANCE_X (40), fall off quickly
        return interpolate(
            probeX.value,
            [0, ENTRANCE_X, ENTRANCE_X + 50, CANAL_LENGTH],
            [0.5, 1.0, 0.2, 0.0], // Fade to 0 intensity deep inside
            'clamp'
        );
    });

    const probeColor = useDerivedValue(() => {
        return interpolateColor(
            intensity.value,
            [0, 1],
            [colors.neutral[300], colors.primary[500]]
        );
    });

    // --- Paths (Memoized) ---
    const topWall = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(0, 100);
        p.quadTo(ENTRANCE_X, 100, ENTRANCE_X + 50, 110);
        p.lineTo(CANAL_LENGTH, 110);
        return p;
    }, []);

    const bottomWall = React.useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(0, 200);
        p.quadTo(ENTRANCE_X, 200, ENTRANCE_X + 50, 190);
        p.lineTo(CANAL_LENGTH, 190);
        return p;
    }, []);

    useAnimatedReaction(
        () => intensity.value,
        (curr, prev) => {
            if (curr !== prev) {
                let text = "Deep Canal (Less Sensitive)";
                if (curr > 0.8) text = "Introitus (High Sensitivity!)";
                else if (curr > 0.4) text = "Mid-Vaginal (Pressure Only)";
                runOnJS(setFeedback)(text);
            }
        }
    );

    return (
        <View style={{ alignItems: 'center' }}>
            {/* Instruction Overlay */}
            <View style={{ position: 'absolute', top: 10, zIndex: 10, alignItems: 'center' }}>
                <Text style={[textStyles.label, { color: colors.text.secondary }]}>
                    {feedback}
                </Text>
            </View>

            <GestureDetector gesture={pan}>
                <View style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, overflow: 'hidden' }}>
                    <Canvas style={{ flex: 1 }}>
                        {/* 1. Background */}
                        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} color={colors.neutral[50]} />

                        {/* 2. Sensation Zone (Nerve Map Texture) */}
                        <Group>
                            {/* The Nerve Texture: Perlin Noise to simulate nerve endings */}
                            <Rect x={0} y={80} width={CANVAS_WIDTH} height={140}>
                                <Turbulence freqX={0.8} freqY={0.8} octaves={4} seed={2} />
                                {/* Mask: Fade out density from left (Entrance) to right (Deep) */}
                                <LinearGradient
                                    start={vec(ENTRANCE_X, 0)}
                                    end={vec(CANAL_LENGTH / 2, 0)}
                                    colors={['rgba(255,100,100,0.5)', 'rgba(200,200,200,0.05)']}
                                />
                            </Rect>

                            {/* Active Glow Overlay (interpolated by intensity) */}
                            <Rect x={0} y={80} width={100} height={140} opacity={intensity}>
                                <LinearGradient
                                    start={vec(0, 0)}
                                    end={vec(100, 0)}
                                    colors={[colors.primary[500], 'transparent']}
                                />
                                <BlurMask blur={20} style="normal" />
                            </Rect>
                        </Group>

                        {/* 3. Anatomy Walls */}
                        <Group style="stroke" strokeWidth={4} color={colors.neutral[300]}>
                            <Path path={topWall} />
                            <Path path={bottomWall} />
                        </Group>

                        {/* 4. The Probe (User Interaction) */}
                        <Group>
                            {/* Glow Aura */}
                            <Circle cx={probeX} cy={150} r={25} color={colors.primary[300]} opacity={0.4}>
                                <BlurMask blur={15} style="normal" />
                            </Circle>

                            {/* Core */}
                            <Circle cx={probeX} cy={150} r={12} color={probeColor} />
                            <Circle cx={probeX} cy={150} r={12} style="stroke" strokeWidth={2} color="white" />
                        </Group>

                    </Canvas>
                </View>
            </GestureDetector>

            <Text style={[textStyles.caption, { marginTop: 10, color: colors.text.tertiary }]}>
                Drag horizontally to explore sensitivity
            </Text>
        </View>
    );
};
