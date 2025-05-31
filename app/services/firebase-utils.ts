import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, firestoreDB } from "../../firebaseConfig";
import { addDoc, collection, doc, query, where, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { LocalUser } from "../models/User";
import { BookReview } from "../models/BookReview";

// Existing auth functions
export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User logged in: ", user);
        const localUser = await getUserByUid(user.uid);
        console.log("Local user: ", localUser);
        return user;
    } catch (error) {
        console.log("Login error: ", error);
        throw error;
    }
};

export const signup = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
        return user;
    } catch (error) {
        console.log("Signup error: ", error);
        throw error;
    }
};

export const logout = () => {
    return signOut(auth);
}

export const saveUserData = async (id: string, firstName: string, lastName: string, email: string) => {
  try {
    const usersRef = collection(firestoreDB, 'users');
    const user: LocalUser = { uid: id, firstName, lastName, email }; 
    return addDoc(usersRef, user);
  } catch (error) {
      throw error;
  }
};

export const getUserByUid = async (uid?: string) => {
  try {
    const usersRef = collection(firestoreDB, 'users');

    const userQuery = query(usersRef, where('uid', '==', uid));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      return userData as LocalUser;
    } else {
      return null; // No user found
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// New functions for reviews

/**
 * Add a book review to Firestore
 */
export const addBookReview = async (
  userId: string, 
  bookId: string, 
  rating: number, 
  reviewText?: string
): Promise<string> => {
  try {
    // Get user data to include name in review
    const user = await getUserByUid(userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Anonymous';
    
    const reviewsRef = collection(firestoreDB, 'reviews');
    const review: BookReview = {
      userId,
      bookId,
      userName,
      rating,
      review: reviewText,
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(reviewsRef, review);
    
    // Also update the user's reviews object
    if (user) {
      const userDoc = await getUserDocRef(userId);
      if (userDoc) {
        const reviews = user.reviews || {};
        reviews[bookId] = docRef.id; // Store review ID
        await updateDoc(userDoc, { reviews });
      }
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

/**
 * Delete a book review from Firestore
 */
export const deleteBookReview = async (reviewId: string, userId: string, bookId: string): Promise<void> => {
  try {
    // Delete the review document
    await deleteDoc(doc(firestoreDB, 'reviews', reviewId));
    
    // Also update the user's reviews
    const userDoc = await getUserDocRef(userId);
    if (userDoc) {
      const user = await getUserByUid(userId);
      if (user && user.reviews) {
        const reviews = { ...user.reviews };
        delete reviews[bookId];
        await updateDoc(userDoc, { reviews });
      }
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

/**
 * Get all reviews for a specific book
 */
export const getBookReviews = async (bookId: string): Promise<BookReview[]> => {
  try {
    const reviewsRef = collection(firestoreDB, 'reviews');
    const reviewQuery = query(reviewsRef, where('bookId', '==', bookId));
    const reviewSnapshot = await getDocs(reviewQuery);
    
    return reviewSnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as BookReview;
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

/**
 * Get a specific review by ID
 */
export const getReviewById = async (reviewId: string): Promise<BookReview | null> => {
  try {
    const reviewDoc = await doc(firestoreDB, 'reviews', reviewId);
    const reviewSnapshot = await getDocs(query(collection(firestoreDB, 'reviews'), where('__name__', '==', reviewId)));
    
    if (!reviewSnapshot.empty) {
      const review = reviewSnapshot.docs[0];
      return {
        id: review.id,
        ...review.data()
      } as BookReview;
    }
    return null;
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
};

// New functions for favorites

/**
 * Helper function to get user document reference
 */
const getUserDocRef = async (userId: string) => {
  const usersRef = collection(firestoreDB, 'users');
  const userQuery = query(usersRef, where('uid', '==', userId));
  const userSnapshot = await getDocs(userQuery);
  
  if (!userSnapshot.empty) {
    return doc(firestoreDB, 'users', userSnapshot.docs[0].id);
  }
  return null;
};

/**
 * Add a book to user's favorites
 */
export const addToFavorites = async (userId: string, bookId: string): Promise<void> => {
  try {
    const userDoc = await getUserDocRef(userId);
    
    if (userDoc) {
      const user = await getUserByUid(userId);
      
      // Initialize favorites array if it doesn't exist
      const favorites = user?.favorites || [];
      
      // Add the book if not already in favorites
      if (!favorites.includes(bookId)) {
        favorites.push(bookId);
        await updateDoc(userDoc, { favorites });
      }
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

/**
 * Remove a book from user's favorites
 */
export const removeFromFavorites = async (userId: string, bookId: string): Promise<void> => {
  try {
    const userDoc = await getUserDocRef(userId);
    
    if (userDoc) {
      const user = await getUserByUid(userId);
      
      // Filter out the book from favorites
      const favorites = (user?.favorites || []).filter(id => id !== bookId);
      
      await updateDoc(userDoc, { favorites });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

/**
 * Check if a book is in user's favorites
 */
export const isBookFavorited = async (userId: string, bookId: string): Promise<boolean> => {
  try {
    const user = await getUserByUid(userId);
    return user?.favorites?.includes(bookId) || false;
  } catch (error) {
    console.error('Error checking if book is favorited:', error);
    throw error;
  }
};

/**
 * Get all favorite book IDs for a user
 */
export const getFavoriteBookIds = async (userId: string): Promise<string[]> => {
  try {
    const user = await getUserByUid(userId);
    return user?.favorites || [];
  } catch (error) {
    console.error('Error getting favorite books:', error);
    throw error;
  }
};

/**
 * Add a book to user's reading list
 */
export const addToReadingList = async (userId: string, bookId: string): Promise<void> => {
  try {
    const userDoc = await getUserDocRef(userId);
    
    if (userDoc) {
      const user = await getUserByUid(userId);
      
      // Initialize reading list array if it doesn't exist
      const readingList = user?.readingList || [];
      
      // Add the book if not already in reading list
      if (!readingList.includes(bookId)) {
        readingList.push(bookId);
        await updateDoc(userDoc, { readingList });
      }
    }
  } catch (error) {
    console.error('Error adding to reading list:', error);
    throw error;
  }
};

/**
 * Remove a book from user's reading list
 */
export const removeFromReadingList = async (userId: string, bookId: string): Promise<void> => {
  try {
    const userDoc = await getUserDocRef(userId);
    
    if (userDoc) {
      const user = await getUserByUid(userId);
      
      // Filter out the book from reading list
      const readingList = (user?.readingList || []).filter(id => id !== bookId);
      
      await updateDoc(userDoc, { readingList });
    }
  } catch (error) {
    console.error('Error removing from reading list:', error);
    throw error;
  }
};
/**
 * Check if a book is in user's reading list
 */
export const isInReadingList = async (userId: string, bookId: string): Promise<boolean> => {
  try {
    const user = await getUserByUid(userId);
    return user?.readingList?.includes(bookId) || false;
  } catch (error) {
    console.error('Error checking if book is in reading list:', error);
    throw error;
  }
};

/**
 * Get all reading list book IDs for a user
 */
export const getReadingListBookIds = async (userId: string): Promise<string[]> => {
  try {
    const user = await getUserByUid(userId);
    return user?.readingList || [];
  } catch (error) {
    console.error('Error getting reading list books:', error);
    throw error;
  }
};