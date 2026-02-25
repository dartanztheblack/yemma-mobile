import storage from '@react-native-firebase/storage';

export const uploadImage = async (uri: string, path: string): Promise<string> => {
  const reference = storage().ref(path);
  await reference.putFile(uri);
  return await reference.getDownloadURL();
};

export const getImageUrl = async (path: string): Promise<string | null> => {
  try {
    const reference = storage().ref(path);
    return await reference.getDownloadURL();
  } catch {
    return null;
  }
};
