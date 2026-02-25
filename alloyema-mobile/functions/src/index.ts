import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe with your secret key
const stripe = new Stripe(functions.config().stripe.secret || 'sk_test_your_key', {
  apiVersion: '2023-10-16',
});

// Commission Yemma (10%)
const COMMISSION_RATE = 0.10;

interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  yemmaId: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

interface PaymentResult {
  clientSecret: string;
  paymentIntentId: string;
  commission: number;
  deliveryFee: number;
  total: number;
}

export const createPaymentIntent = functions.https.onCall(async (data: CreatePaymentIntentData, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { amount, currency = 'eur', yemmaId, customerId, metadata = {} } = data;

  // Validation
  if (!amount || amount <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount must be greater than 0');
  }

  if (!yemmaId) {
    throw new functions.https.HttpsError('invalid-argument', 'Yemma ID is required');
  }

  try {
    // Calculate fees
    const commission = Math.round(amount * COMMISSION_RATE * 100) / 100; // in euros
    const deliveryFee = amount > 20 ? 0 : 3; // Free delivery over 20€
    
    // Convert to cents for Stripe
    const amountInCents = Math.round((amount + commission + deliveryFee) * 100);

    // Create customer if not exists
    let stripeCustomerId = customerId;
    if (!stripeCustomerId) {
      const user = await admin.auth().getUser(context.auth.uid);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          firebaseUid: context.auth.uid,
        },
      });
      stripeCustomerId = customer.id;

      // Save customer ID to Firestore
      await admin.firestore().collection('users').doc(context.auth.uid).update({
        stripeCustomerId: customer.id,
      });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      customer: stripeCustomerId,
      automatic_payment_methods: { enabled: true },
      metadata: {
        firebaseUid: context.auth.uid,
        yemmaId,
        originalAmount: amount.toString(),
        commission: commission.toString(),
        deliveryFee: deliveryFee.toString(),
        ...metadata,
      },
    });

    // Save order to Firestore
    await admin.firestore().collection('orders').add({
      userId: context.auth.uid,
      yemmaId,
      amount,
      commission,
      deliveryFee,
      total: amount + commission + deliveryFee,
      paymentIntentId: paymentIntent.id,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const result: PaymentResult = {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      commission,
      deliveryFee,
      total: amount + commission + deliveryFee,
    };

    return result;
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Webhook for Stripe events
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig as string, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailure(failedPayment);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { firebaseUid, yemmaId } = paymentIntent.metadata || {};

  // Update order status
  const ordersRef = admin.firestore().collection('orders');
  const snapshot = await ordersRef.where('paymentIntentId', '==', paymentIntent.id).get();
  
  if (!snapshot.empty) {
    const orderDoc = snapshot.docs[0];
    await orderDoc.ref.update({
      status: 'paid',
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Send notification to Yemma
  if (yemmaId) {
    const yemmaDoc = await admin.firestore().collection('yemmas').doc(yemmaId).get();
    const yemmaData = yemmaDoc.data();
    
    if (yemmaData?.pushToken) {
      await admin.messaging().send({
        token: yemmaData.pushToken,
        notification: {
          title: 'Nouvelle commande ! 🎉',
          body: `Vous avez reçu une commande de ${paymentIntent.amount / 100}€`,
        },
        data: {
          type: 'new_order',
          orderId: snapshot.docs[0]?.id || '',
        },
      });
    }
  }

  // Send notification to customer
  if (firebaseUid) {
    const userDoc = await admin.firestore().collection('users').doc(firebaseUid).get();
    const userData = userDoc.data();

    if (userData?.pushToken) {
      await admin.messaging().send({
        token: userData.pushToken,
        notification: {
          title: 'Commande confirmée ! ✅',
          body: 'Votre paiement a été accepté. La Yemma prépare votre commande.',
        },
        data: {
          type: 'order_confirmed',
          orderId: snapshot.docs[0]?.id || '',
        },
      });
    }
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const ordersRef = admin.firestore().collection('orders');
  const snapshot = await ordersRef.where('paymentIntentId', '==', paymentIntent.id).get();
  
  if (!snapshot.empty) {
    await snapshot.docs[0].ref.update({
      status: 'failed',
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
      errorMessage: paymentIntent.last_payment_error?.message,
    });
  }
}
