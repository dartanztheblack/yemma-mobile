import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const YEMMAS = [
  { id: '1', name: 'Yemma Fatima', specialty: 'Cuisine marocaine traditionnelle', rating: 4.8, distance: '1.2 km', price: '15€/plat', image: '👩‍🍳', tags: ['Couscous', 'Tajine'] },
  { id: '2', name: 'Yemma Aïcha', specialty: 'Spécialités tunisiennes', rating: 4.9, distance: '2.4 km', price: '12€/plat', image: '👩‍🍳', tags: ['Briouats', 'Chorba'] },
  { id: '3', name: 'Yemma Samira', specialty: 'Pâtisseries orientales', rating: 4.7, distance: '0.8 km', price: '8€/port', image: '👩‍🍳', tags: ['Baklava', 'Makrout'] },
  { id: '4', name: 'Yemma Leila', specialty: 'Cuisine algérienne', rating: 4.6, distance: '3.1 km', price: '14€/plat', image: '👩‍🍳', tags: ['Chakhchoukha', 'Couscous'] },
];

const CATEGORIES = ['Tout', 'Couscous', 'Tajine', 'Pastilla', 'Briouats', 'Chorba', 'Desserts'];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');

  const filteredYemmas = YEMMAS.filter(yemma => {
    const matchesSearch = yemma.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         yemma.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tout' || yemma.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Yemma</Text>
          <Text style={styles.tagline}>Cuisine authentique à domicile</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une Yemma ou un plat..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.categoryBadge, selectedCategory === cat && styles.categoryBadgeActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredYemmas.length} Yemma{filteredYemmas.length > 1 ? 's' : ''} disponible{filteredYemmas.length > 1 ? 's' : ''}
          </Text>

          {filteredYemmas.map((yemma) => (
            <TouchableOpacity 
              key={yemma.id} 
              style={styles.card}
              onPress={() => navigation.navigate('YemmaDetail', { yemmaId: yemma.id })}
            >
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.placeholderText}>{yemma.image}</Text>
              </View>
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{yemma.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {yemma.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.cardSubtitle}>{yemma.specialty}</Text>
                
                <View style={styles.tagsContainer}>
                  {yemma.tags.map(tag => (
                    <View key={tag} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.price}>{yemma.price}</Text>
                  <View style={styles.distanceBadge}>
                    <Ionicons name="location" size={14} color="#ff6b35" />
                    <Text style={styles.distance}>{yemma.distance}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.payButton}
                  onPress={() => navigation.navigate('Payment', {
                    amount: parseInt(yemma.price),
                    yemmaName: yemma.name,
                    description: yemma.specialty
                  })}
                >
                  <Text style={styles.payButtonText}>Commander</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#ff6b35',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryBadgeActive: {
    backgroundColor: '#ff6b35',
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImagePlaceholder: {
    height: 140,
    backgroundColor: '#ffe4d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  payButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
