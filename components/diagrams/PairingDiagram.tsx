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
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import {
    interpolateColor,
    useDerivedValue,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

export const PairingDiagram = () => {
    const { width } = useWindowDimensions();
    const CANVAS_WIDTH = width - 40;
    const CANVAS_HEIGHT = 350; // Taller for the full wishbone shape

    // --- State ---
    const externalActive = useSharedValue(0); // 0 or 1
    const internalActive = useSharedValue(0); // 0 or 1

    // --- Derived Visuals ---
    // If BOTH are active, we get a "Pairing Bonus" (extra glow/color)
    const isPaired = useDerivedValue(() => {
        return externalActive.value > 0.5 && internalActive.value > 0.5 ? 1 : 0;
    });

    const glansColor = useDerivedValue(() => {
        return interpolateColor(
            externalActive.value,
            [0, 1],
            [colors.neutral[300], colors.primary[500]]
        );
    });

    const legsColor = useDerivedValue(() => {
        return interpolateColor(
            internalActive.value,
            [0, 1],
            [colors.neutral[300], colors.primary[400]] // Slightly different shade?
        );
    });

    // "Connection" Glow - only visible when paired
    const connectionOpacity = useDerivedValue(() => {
        return withSpring(isPaired.value);
    });

    // --- Paths (Anatomy) ---
    // 1. Vaginal Canal (Central Tube)
    const canalPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        const CX = CANVAS_WIDTH / 2;
        // Simple tube
        p.moveTo(CX - 25, 120);
        p.lineTo(CX - 20, 300);
        p.quadTo(CX, 310, CX + 20, 300);
        p.lineTo(CX + 25, 120);
        return p;
    }, [CANVAS_WIDTH]);

    // 2. Clitoral Glans (The "Button" at top)
    const glansPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        const CX = CANVAS_WIDTH / 2;
        // Small oval above the canal
        p.addOval(QtRect(CX - 15, 60, 30, 30));
        return p;
    }, [CANVAS_WIDTH]);

    // Helper for rect
    function QtRect(x: number, y: number, w: number, h: number) {
        return { x, y, width: w, height: h } as any; // Skia Rect type hack if needed, or just standard object
    }

    // 3. Clitoral Legs/Crura (The Wishbone)
    const legsPath = React.useMemo(() => {
        const p = Skia.Path.Make();
        const CX = CANVAS_WIDTH / 2;
        // Start from glans area, sweep down and out around the canal
        // Left Leg
        p.moveTo(CX - 10, 80);
        p.quadTo(CX - 60, 120, CX - 50, 250); // Curve out then down
        p.quadTo(CX - 30, 260, CX - 30, 200); // Inner curve back up
        p.quadTo(CX - 30, 120, CX - 10, 90);  // Back to top

        // Right Leg (Mirror)
        p.moveTo(CX + 10, 80);
        p.quadTo(CX + 60, 120, CX + 50, 250);
        p.quadTo(CX + 30, 260, CX + 30, 200);
        p.quadTo(CX + 30, 120, CX + 10, 90);

        return p;
    }, [CANVAS_WIDTH]);

    const toggleExternal = () => { externalActive.value = withSpring(externalActive.value === 0 ? 1 : 0); };
    const toggleInternal = () => { internalActive.value = withSpring(internalActive.value === 0 ? 1 : 0); };

    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, overflow: 'hidden', backgroundColor: colors.neutral[50], borderRadius: 12 }}>
                <Canvas style={{ flex: 1 }}>
                    {/* Canal (Context) */}
                    <Path path={canalPath} color={colors.neutral[200]} />
                    <Path path={canalPath} style="stroke" strokeWidth={2} color={colors.neutral[300]} />

                    {/* Legs (Internal) */}
                    <Group>
                        <Path path={legsPath} color={legsColor} />
                        {/* Glow for legs */}
                        <Path path={legsPath} color={colors.primary[300]} opacity={connectionOpacity}>
                            <BlurMask blur={10} style="normal" />
                        </Path>
                    </Group>

                    {/* Glans (External) */}
                    <Group>
                        <Path path={glansPath} color={glansColor} />
                        {/* Glow for glans */}
                        <Path path={glansPath} color="white" opacity={externalActive} style="stroke" strokeWidth={2}>
                            <BlurMask blur={4} style="normal" />
                        </Path>
                    </Group>

                    {/* Pairing Energy (The Bridge) */}
                    {/* Visualizing the nerve connection between them */}
                    <Circle cx={CANVAS_WIDTH / 2} cy={90} r={40} color={colors.primary[500]} opacity={connectionOpacity}>
                        <BlurMask blur={30} style="normal" />
                    </Circle>

                </Canvas>

                {/* Overlay Text Labels (Interactive Buttons) */}
                <View style={[StyleSheet.absoluteFill, { justifyContent: 'space-between', paddingVertical: 40 }]}>
                    <TouchableOpacity onPress={toggleExternal} style={{ alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20 }}>
                        <Text style={[textStyles.label, { color: colors.primary[700] }]}>External (Glans)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleInternal} style={{ alignSelf: 'center', marginBottom: 40, backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20 }}>
                        <Text style={[textStyles.label, { color: colors.primary[700] }]}>Internal (Canal)</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={[textStyles.caption, { marginTop: 10, color: colors.text.tertiary, textAlign: 'center' }]}>
                Tap the labels to activate stimulation types. {"\n"}See how they connect.
            </Text>
        </View>
    );
};
