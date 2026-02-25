// Version simplifiée sans Firebase natif pour le build EAS
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback({ uid: 'demo', email: 'demo@yemma.com' });
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ user: { uid: 'demo', email: 'demo@yemma.com' } }),
  createUserWithEmailAndPassword: async () => ({ user: { uid: 'demo', email: 'demo@yemma.com' } }),
  signOut: async () => {},
};

export const db = {
  collection: () => ({
    doc: () => ({
      set: async () => {},
      get: async () => ({ exists: true, data: () => ({}) }),
    }),
    add: async () => ({ id: 'demo' }),
    where: () => ({
      get: async () => ({ docs: [] }),
    }),
  }),
};

export const storage = {
  ref: () => ({
    putFile: async () => ({}),
    getDownloadURL: async () => 'https://example.com/image.jpg',
  }),
};
