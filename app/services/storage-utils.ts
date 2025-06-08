import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to AsyncStorage.
 * @param key The key to store the data under.
 * @param value The data to store.
 */
export const saveToStorage = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

/**
 * Retrieve data from AsyncStorage.
 * @param key The key to retrieve the data from.
 * @returns The retrieved data, or null if not found.
 */
export const getFromStorage = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving from storage:', error);
    return null;
  }
};
