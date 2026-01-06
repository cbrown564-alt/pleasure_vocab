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

export const RockingDiagram = () => {
    const { width } = useWindowDimensions();
    const CANVAS_WIDTH = width - 40;
    const CANVAS_HEIGHT = 300;

    // Anatomy Constants
    const RECEIVER_PUBIC_X = 140;
    const RECEIVER_PUBIC_Y = 160;

    // Animation State
    // The 'Partner' bone position. Starts slightly separated.
    const partnerX = useSharedValue(RECEIVER_PUBIC_X - 60);
    const partnerY = useSharedValue(RECEIVER_PUBIC_Y - 40);

    const [feedback, setFeedback] = React.useState("Neutral");

    // Interaction
    const pan = Gesture.Pan()
        .onChange((e) => {
            partnerX.value += e.changeX;
            partnerY.value += e.changeY;
        })
        .onEnd(() => {
            // Optional: snap back or stay? Let's stay for free exploration
            // but maybe constrain to bounds
        });

    // Physics: Calculate "Grinding Intensity"
    // Intensity is high when distance is small (close contact) and constant
    const distance = useDerivedValue(() => {
        const dx = partnerX.value - RECEIVER_PUBIC_X;
        const dy = partnerY.value - RECEIVER_PUBIC_Y;
        return Math.sqrt(dx * dx + dy * dy);
    });

    const intensity = useDerivedValue(() => {
        // Close contact (< 30px) means high intensity
        // We map distance 0->60 to intensity 1->0
        return interpolate(distance.value, [0, 60], [1, 0], 'clamp');
    });

    const heatColor = useDerivedValue(() => {
        return interpolateColor(
            intensity.value,
            [0, 0.5, 1],
            [colors.neutral[300], 'orange', colors.primary[500]]
        );
    });

    const glowRadius = useDerivedValue(() => {
        return interpolate(intensity.value, [0, 1], [5, 25]);
    });

    useAnimatedReaction(
        () => intensity.value,
        (curr, prev) => {
            if (curr !== prev && curr !== null) {
                let text = "No Contact";
                if (curr > 0.8) text = "Grinding (High Contact)";
                else if (curr > 0.4) text = "Touching";
                else if (curr > 0.1) text = "Near";
                runOnJS(setFeedback)(text);
            }
        }
    );

    // --- Paths ---
    const receiverPelvis = React.useMemo(() => {
        const p = Skia.Path.Make();
        // Schematic side view of pelvis/spine
        p.moveTo(RECEIVER_PUBIC_X + 40, 100); // Spine top
        p.quadTo(RECEIVER_PUBIC_X, 140, RECEIVER_PUBIC_X, RECEIVER_PUBIC_Y); // Curve down to pubic bone (Symphysis)
        p.lineTo(RECEIVER_PUBIC_X + 20, RECEIVER_PUBIC_Y + 40); // Tailbone-ish
        return p;
    }, []);

    const partnerBonePath = React.useMemo(() => {
        const p = Skia.Path.Make();
        // Schematic "wedge" representing the partner's pelvis/base
        p.moveTo(0, -30);
        p.lineTo(30, -30);
        p.quadTo(30, 0, 0, 0); // Rounded contact point at (0,0) - this will be translated
        p.lineTo(-30, -30);
        p.close();
        return p;
    }, []);


    const partnerTransform = useDerivedValue(() => {
        return [{ translateX: partnerX.value }, { translateY: partnerY.value }];
    });

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
                        {/* 1. Receiver Anatomy (Static) */}
                        <Group style="stroke" strokeWidth={6} color={colors.neutral[300]} strokeCap="round">
                            <Path path={receiverPelvis} />
                        </Group>
                        <Circle cx={RECEIVER_PUBIC_X} cy={RECEIVER_PUBIC_Y} r={8} color={colors.neutral[400]} />

                        {/* 2. Heat / Friction Glow (At Contact Point) */}
                        <Circle cx={RECEIVER_PUBIC_X} cy={RECEIVER_PUBIC_Y} r={30} color={heatColor} opacity={intensity}>
                            <BlurMask blur={glowRadius} style="normal" />
                        </Circle>

                        {/* 3. Partner Anatomy (Interactive) */}
                        <Group
                            color={colors.primary[300]}
                            origin={{ x: 0, y: 0 }}
                            transform={partnerTransform}
                        >
                            {/* The Bone Shape */}
                            <Path path={partnerBonePath} color={colors.primary[600]} />
                            {/* Contact Point indicator */}
                            <Circle cx={0} cy={0} r={5} color="white" />
                        </Group>

                    </Canvas>
                </View>
            </GestureDetector>

            <Text style={[textStyles.caption, { marginTop: 10, color: colors.text.tertiary }]}>
                Drag the wedge to "grind" against the circle
            </Text>
        </View>
    );
};
