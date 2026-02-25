import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentScreenProps {
  route?: {
    params?: {
      amount: number;
      yemmaName: string;
      description: string;
    };
  };
  navigation?: any;
}

export function PaymentScreen({ route, navigation }: PaymentScreenProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  
  // Default values for demo/testing
  const amount = route?.params?.amount || 25;
  const yemmaName = route?.params?.yemmaName || 'Yemma Fatima';
  const description = route?.params?.description || 'Couscous Royal + Dessert';

  const initializePayment = async () => {
    setLoading(true);
    try {
      // In production, this should call your backend to create a payment intent
      // For demo, we'll simulate a client-side payment
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: 'pi_demo_secret', // Replace with real secret from backend
        merchantDisplayName: 'Yemma',
        style: 'alwaysLight',
        defaultBillingDetails: {
          name: 'Client Yemma',
        },
      });

      if (error) {
        Alert.alert('Erreur', error.message);
      } else {
        openPaymentSheet();
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === 'Canceled') {
        // User cancelled, no alert needed
        return;
      }
      Alert.alert('Erreur de paiement', error.message);
    } else {
      Alert.alert(
        '✅ Paiement réussi !',
        `Votre commande chez ${yemmaName} a été payée.`,
        [{ text: 'OK', onPress: () => navigation?.goBack() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Résumé de la commande</Text>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Yemma</Text>
            <Text style={styles.orderValue}>{yemmaName}</Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Commande</Text>
            <Text style={styles.orderValue}>{description}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.orderRow}>
            <Text style={styles.totalLabel}>Total à payer</Text>
            <Text style={styles.totalValue}>{amount} €</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Moyen de paiement</Text>
          
          <TouchableOpacity style={styles.paymentMethod} onPress={initializePayment}>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>💳</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Carte bancaire</Text>
              <Text style={styles.paymentSubtitle}>Visa, Mastercard, etc.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.paymentMethodDisabled}>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>🍎</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Apple Pay</Text>
              <Text style={styles.paymentSubtitle}>Bientôt disponible</Text>
            </View>
            <Text style={styles.comingSoon}>Bientôt</Text>
          </View>

          <View style={styles.paymentMethodDisabled}>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>💰</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Espèces à la livraison</Text>
              <Text style={styles.paymentSubtitle}>Payez directement à la Yemma</Text>
            </View>
            <Text style={styles.comingSoon}>Bientôt</Text>
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color="#666" />
          <Text style={styles.securityText}>Paiement sécurisé par Stripe</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentMethodDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    opacity: 0.5,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconText: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  comingSoon: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});
