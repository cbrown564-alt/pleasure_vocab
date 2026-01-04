import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEYS = {
    UNLOCKED_CONCEPTS: 'user_unlocked_concepts',
    MASTERED_CONCEPTS: 'user_mastered_concepts', // "Collected" / "Tried"
};

export interface UserProgressStore {
    unlockedConcepts: string[];
    masteredConcepts: string[];
    unlockConcept: (id: string) => Promise<void>;
    masterConcept: (id: string) => Promise<void>;
    isUnlocked: (id: string) => boolean;
    isMastered: (id: string) => boolean;
    loading: boolean;
}

// Simple hook-based store for now
export function useUserProgress(): UserProgressStore {
    const [unlockedConcepts, setUnlockedConcepts] = useState<string[]>([]);
    const [masteredConcepts, setMasteredConcepts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Load initial state
    useEffect(() => {
        async function load() {
            try {
                const unlocked = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_CONCEPTS);
                const mastered = await AsyncStorage.getItem(STORAGE_KEYS.MASTERED_CONCEPTS);

                if (unlocked) setUnlockedConcepts(JSON.parse(unlocked));
                // Default unlock: typically you'd unlock the first few if empty? 
                // For now, let's assume onboarding handles initial unlocks or they are all unlocked?
                // Strategy said: "Starter Pack: User starts with 3 empty slots." 
                // Actually, let's start with nothing unlocked, or maybe just the 'free' ones are unlocked?
                // Let's assume for now default open, but we track "Collection" (mastery) mainly.
                // Actually the strategy said "Locked: Greyed out". So we need an unlock mechanism.
                // Let's seed with 'angling', 'rocking', 'shallowing' if empty.
                else {
                    const defaultUnlocked = ['angling', 'rocking', 'shallowing'];
                    setUnlockedConcepts(defaultUnlocked);
                    AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_CONCEPTS, JSON.stringify(defaultUnlocked));
                }

                if (mastered) setMasteredConcepts(JSON.parse(mastered));
            } catch (e) {
                console.error('Failed to load user progress', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const unlockConcept = useCallback(async (id: string) => {
        setUnlockedConcepts(prev => {
            if (prev.includes(id)) return prev;
            const next = [...prev, id];
            AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_CONCEPTS, JSON.stringify(next));
            return next;
        });
    }, []);

    const masterConcept = useCallback(async (id: string) => {
        setMasteredConcepts(prev => {
            if (prev.includes(id)) return prev;
            const next = [...prev, id];
            AsyncStorage.setItem(STORAGE_KEYS.MASTERED_CONCEPTS, JSON.stringify(next));
            return next;
        });
    }, []);

    const isUnlocked = useCallback((id: string) => unlockedConcepts.includes(id), [unlockedConcepts]);
    const isMastered = useCallback((id: string) => masteredConcepts.includes(id), [masteredConcepts]);

    return {
        unlockedConcepts,
        masteredConcepts,
        unlockConcept,
        masterConcept,
        isUnlocked,
        isMastered,
        loading,
    };
}
