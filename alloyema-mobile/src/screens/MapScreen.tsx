import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import MapView, { Marker } from 'react-native-maps'; // Désactivé pour Expo Go

export function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Carte désactivée pour Expo Go - utiliser build natif pour Maps */}
      <View style={styles.placeholder}>
        <Text style={styles.emoji}>🗺️</Text>
        <Text style={styles.title}>Carte des Yemmas</Text>
        <Text style={styles.subtitle}>📍 Yemma Fatima - 1.2km</Text>
        <Text style={styles.subtitle}>📍 Yemma Aïcha - 2.4km</Text>
        <Text style={styles.subtitle}>📍 Yemma Samira - 0.8km</Text>
        <Text style={styles.note}>(Carte interactive disponible en mode natif)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
