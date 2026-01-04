import { ConceptDeck } from '@/components/ConceptDeck';
import { Button } from '@/components/ui/Button';
import { Text as ThemedText } from '@/components/ui/Typography';
import { getConceptById } from '@/data/vocabulary';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ConceptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const concept = getConceptById(id);

  if (!concept) {
    return (
      <View style={styles.center}>
        <ThemedText>Concept not found</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} variant="ghost" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ConceptDeck concept={concept} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});
