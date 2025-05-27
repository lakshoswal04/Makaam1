import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase.config';

export const userService = {
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: [],
        completedResources: [],
        checkIns: []
      });
    } catch (error) {
      throw error;
    }
  },

  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
      throw error;
    }
  },

  async updateUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async addProgress(userId, progressData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        progress: arrayUnion(progressData),
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async addCompletedResource(userId, resourceId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        completedResources: arrayUnion(resourceId),
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async addCheckIn(userId, checkInData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        checkIns: arrayUnion({
          ...checkInData,
          timestamp: new Date()
        }),
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  }
}; 