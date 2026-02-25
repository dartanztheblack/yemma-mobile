import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  Image, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';
import { uploadImage } from '../services/storage';

interface Message {
  id: string;
  text: string;
  imageUrl?: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string;
}

// Mock conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Yemma Fatima', lastMessage: 'Votre couscous est prêt ! 🍽️', timestamp: new Date(), unread: 2, avatar: '👩‍🍳' },
  { id: '2', name: 'Yemma Aïcha', lastMessage: 'À quelle heure souhaitez-vous récupérer?', timestamp: new Date(Date.now() - 86400000), unread: 0, avatar: '👩‍🍳' },
  { id: '3', name: 'Support Yemma', lastMessage: 'Merci pour votre confiance !', timestamp: new Date(Date.now() - 172800000), unread: 0, avatar: '🎧' },
];

// Mock messages for conversation 1
const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'Bonjour ! Je voudrais commander un couscous pour demain', senderId: 'user', senderName: 'Moi', timestamp: new Date(Date.now() - 3600000), read: true },
  { id: '2', text: 'Bonjour ! Avec plaisir, pour combien de personnes ?', senderId: 'yemma', senderName: 'Yemma Fatima', timestamp: new Date(Date.now() - 3500000), read: true },
  { id: '3', text: 'Pour 4 personnes s\'il vous plaît', senderId: 'user', senderName: 'Moi', timestamp: new Date(Date.now() - 3400000), read: true },
  { id: '4', text: 'Parfait ! Je prépare ça. Voici une photo du plat :', senderId: 'yemma', senderName: 'Yemma Fatima', timestamp: new Date(Date.now() - 3300000), read: true },
  { id: '5', text: '🥘', imageUrl: 'placeholder', senderId: 'yemma', senderName: 'Yemma Fatima', timestamp: new Date(Date.now() - 3200000), read: false },
  { id: '6', text: 'Votre couscous est prêt ! 🍽️', senderId: 'yemma', senderName: 'Yemma Fatima', timestamp: new Date(Date.now() - 60000), read: false },
];

export function MessagesScreen() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (selectedConversation) {
      // In real app: subscribe to Firestore messages
      setMessages(MOCK_MESSAGES);
    }
  }, [selectedConversation]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      sendMessage('', result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Veuillez autoriser l\'accès à la caméra');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      sendMessage('', result.assets[0].uri);
    }
  };

  const sendMessage = async (text: string, imageUri?: string) => {
    if (!text.trim() && !imageUri) return;

    setSending(true);
    try {
      let imageUrl;
      if (imageUri) {
        // Upload to Firebase Storage
        const path = `messages/${user?.uid}/${Date.now()}.jpg`;
        imageUrl = await uploadImage(imageUri, path);
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        imageUrl,
        senderId: user?.uid || 'user',
        senderName: 'Moi',
        timestamp: new Date(),
        read: false,
      };

      // In real app: add to Firestore
      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Conversation list view
  if (!selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        <FlatList
          data={MOCK_CONVERSATIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.conversationItem}
              onPress={() => setSelectedConversation(item)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </View>
              
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
                </View>
                
                <View style={styles.conversationFooter}>
                  <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    );
  }

  // Chat view
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setSelectedConversation(null)}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>{selectedConversation.name}</Text>
          <Text style={styles.chatHeaderStatus}>En ligne</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="call" size={24} color="#ff6b35" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.senderId === 'user' ? styles.myMessage : styles.theirMessage
          ]}>
            {item.text ? (
              <Text style={[
                styles.messageText,
                item.senderId === 'user' ? styles.myMessageText : styles.theirMessageText
              ]}>{item.text}</Text>
            ) : null}
            
            {item.imageUrl ? (
              <View style={styles.messageImagePlaceholder}>
                <Text style={styles.messageImageEmoji}>{item.imageUrl === 'placeholder' ? '🥘' : '📷'}</Text>
              </View>
            ) : null}
            
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachButton} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="#666" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Écrivez un message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity 
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffe4d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 78,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff6b35',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#333',
  },
  messageImagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: '#ffe4d6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageImageEmoji: {
    fontSize: 60,
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
