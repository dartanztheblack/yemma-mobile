import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, 
  Dimensions, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface YemmaDetail {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  photos: string[];
  hours: string;
  menu: MenuItem[];
  reviews: Review[];
}

// Mock data
const MOCK_YEMMA: YemmaDetail = {
  id: '1',
  name: 'Yemma Fatima',
  specialty: 'Cuisine marocaine traditionnelle',
  bio: 'Passionnée par la cuisine depuis 20 ans, je prépare des plats authentiques avec des recettes transmises de génération en génération. Tous mes ingrédients sont frais et locaux.',
  rating: 4.8,
  reviewsCount: 127,
  distance: '1.2 km',
  photos: ['🥘', '🍲', '🥗', '🍰'],
  hours: 'Lun-Ven: 11h-21h\nSam-Dim: 10h-22h',
  menu: [
    { id: '1', name: 'Couscous Royal', price: 15, description: 'Agneau, poulet, merguez, légumes' },
    { id: '2', name: 'Tajine de poulet', price: 12, description: 'Poulet, citrons confits, olives' },
    { id: '3', name: 'Pastilla au poulet', price: 18, description: 'Feuilleté, amandes, cannelle' },
    { id: '4', name: 'Briouats', price: 8, description: '6 pièces au choix (viande/poisson/fromage)' },
    { id: '5', name: 'Harira', price: 6, description: 'Soupe traditionnelle' },
    { id: '6', name: 'Cornes de gazelle', price: 10, description: '12 pièces' },
  ],
  reviews: [
    { id: '1', user: 'Karim B.', rating: 5, comment: 'Excellent couscous, très généreux !', date: '2 jours' },
    { id: '2', user: 'Sarah L.', rating: 5, comment: 'La pastilla est divine, je recommande.', date: '1 sem' },
    { id: '3', user: 'Ahmed T.', rating: 4, comment: 'Très bon, livraison un peu lente.', date: '2 sem' },
  ],
};

export function YemmaDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const yemma = MOCK_YEMMA;

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalPrice = selectedItems.reduce((sum, itemId) => {
    const item = yemma.menu.find(m => m.id === itemId);
    return sum + (item?.price || 0);
  }, 0);

  const commission = Math.round(totalPrice * 0.10);
  const deliveryFee = totalPrice > 20 ? 0 : 3;
  const finalTotal = totalPrice + commission + deliveryFee;

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={24} color="#ff6b35" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photos Carousel */}
        <View style={styles.photosContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setActivePhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {yemma.photos.map((photo, index) => (
              <View key={index} style={[styles.photoSlide, { width }]} >
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoEmoji}>{photo}</Text>
                  <Text style={styles.photoLabel}>Plat {index + 1}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {yemma.photos.map((_, index) => (
              <View 
                key={index} 
                style={[styles.paginationDot, index === activePhotoIndex && styles.paginationDotActive]} 
              />
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{yemma.name}</Text>
          <Text style={styles.specialty}>{yemma.specialty}</Text>
          
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>{renderStars(yemma.rating)} {yemma.rating}</Text>
            <Text style={styles.reviews}>({yemma.reviewsCount} avis)</Text>
            <View style={styles.distanceBadge}>
              <Ionicons name="location" size={14} color="#ff6b35" />
              <Text style={styles.distance}>{yemma.distance}</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.bio}>{yemma.bio}</Text>
        </View>

        {/* Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires</Text>
          <View style={styles.hoursCard}>
            <Ionicons name="time-outline" size={20} color="#ff6b35" />
            <Text style={styles.hoursText}>{yemma.hours}</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          
          {yemma.menu.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, selectedItems.includes(item.id) && styles.menuItemSelected]}
              onPress={() => toggleItem(item.id)}
            >
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDesc}>{item.description}</Text>
              </View>
              
              <View style={styles.menuItemRight}>
                <Text style={styles.menuItemPrice}>{item.price} €</Text>
                <View style={[styles.checkbox, selectedItems.includes(item.id) && styles.checkboxChecked]}>
                  {selectedItems.includes(item.id) && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avis clients</Text>
          
          {yemma.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewRating}>{renderStars(review.rating)}</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      {selectedItems.length > 0 ? (
        <View style={styles.bottomBar}>
          <View style={styles.priceBreakdown}>
            <Text style={styles.subtotal}>Sous-total: {totalPrice} €</Text>
            <Text style={styles.fees}>Commission (10%): {commission} € | Livraison: {deliveryFee === 0 ? 'Gratuite' : deliveryFee + ' €'}</Text>
            <Text style={styles.total}>Total: {finalTotal} €</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => navigation.navigate('Payment', {
              amount: finalTotal,
              yemmaName: yemma.name,
              description: `${selectedItems.length} plat(s) sélectionné(s)`
            })}
          >
            <Text style={styles.orderButtonText}>Commander</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubbles" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Contacter</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosContainer: {
    height: 300,
  },
  photoSlide: {
    height: 300,
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#ffe4d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEmoji: {
    fontSize: 100,
  },
  photoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  infoSection: {
    padding: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rating: {
    fontSize: 16,
    color: '#333',
  },
  reviews: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },
  hoursText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    lineHeight: 22,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemSelected: {
    backgroundColor: '#fff5f2',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuItemDesc: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b35',
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewRating: {
    fontSize: 14,
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ff6b35',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  priceBreakdown: {
    flex: 1,
  },
  subtotal: {
    fontSize: 14,
    color: '#666',
  },
  fees: {
    fontSize: 12,
    color: '#999',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
