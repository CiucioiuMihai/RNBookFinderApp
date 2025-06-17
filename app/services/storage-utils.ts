import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to AsyncStorage.
 * @param key The key to store the data under.
 * @param value The data to store.
 */
export const saveToStorage = async (key: string, value: any): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Successfully saved data for key: ${key}`);
    
    // Verify data was saved correctly
    try {
      const savedData = await AsyncStorage.getItem(key);
      if (savedData === jsonValue) {
        console.log(`Verified data saved correctly for key: ${key}`);
        return true;
      } else {
        console.warn(`Data verification failed for key: ${key}`);
        return false;
      }
    } catch (verifyError) {
      console.error(`Error verifying saved data for key ${key}:`, verifyError);
      return false;
    }
  } catch (error) {
    console.error(`Error saving to storage for key ${key}:`, error);
    return false;
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
    if (jsonValue != null) {
      try {
        const parsedData = JSON.parse(jsonValue);
        console.log(`Successfully retrieved and parsed data for key: ${key}`);
        return parsedData;
      } catch (parseError) {
        console.error(`Error parsing data for key ${key}:`, parseError);
        return null;
      }
    } else {
      console.log(`No data found for key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving from storage for key ${key}:`, error);
    return null;
  }
};
