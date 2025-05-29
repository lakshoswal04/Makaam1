import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase.config';

export const resourceService = {
  async createResource(resourceData) {
    try {
      const resourceRef = doc(collection(db, 'resources'));
      await setDoc(resourceRef, {
        ...resourceData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return resourceRef.id;
    } catch (error) {
      throw error;
    }
  },

  async getResource(resourceId) {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      const resourceSnap = await getDoc(resourceRef);
      return resourceSnap.exists() ? { id: resourceSnap.id, ...resourceSnap.data() } : null;
    } catch (error) {
      throw error;
    }
  },

  async getAllResources() {
    try {
      const resourcesRef = collection(db, 'resources');
      const resourcesSnap = await getDocs(resourcesRef);
      return resourcesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  async getResourcesByCategory(category) {
    try {
      const resourcesRef = collection(db, 'resources');
      const q = query(
        resourcesRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const resourcesSnap = await getDocs(q);
      return resourcesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  async updateResource(resourceId, resourceData) {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      await updateDoc(resourceRef, {
        ...resourceData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteResource(resourceId) {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      await deleteDoc(resourceRef);
    } catch (error) {
      throw error;
    }
  }
}; 