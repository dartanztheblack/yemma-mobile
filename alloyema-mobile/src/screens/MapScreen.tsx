import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';

export function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 48.8566, longitude: 2.3522 }}
          title="Yemma Fatima"
          description="Cuisine marocaine"
        />
        <Marker
          coordinate={{ latitude: 48.86, longitude: 2.36 }}
          title="Yemma Aïcha"
          description="Spécialités tunisiennes"
        />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>📍 Yemmas autour de vous</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
