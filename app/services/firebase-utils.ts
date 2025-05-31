import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, firestoreDB } from "../../firebaseConfig";
import { addDoc, collection, doc, query, where, getDocs } from "firebase/firestore";
import { LocalUser } from "../models/User";

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