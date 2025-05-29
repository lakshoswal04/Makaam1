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
  orderBy,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase.config';

export const roadmapService = {
  async createRoadmap(roadmapData) {
    try {
      const roadmapRef = doc(collection(db, 'roadmaps'));
      await setDoc(roadmapRef, {
        ...roadmapData,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: roadmapData.steps || [],
        enrolledUsers: []
      });
      return roadmapRef.id;
    } catch (error) {
      throw error;
    }
  },

  async getRoadmap(roadmapId) {
    try {
      const roadmapRef = doc(db, 'roadmaps', roadmapId);
      const roadmapSnap = await getDoc(roadmapRef);
      return roadmapSnap.exists() ? { id: roadmapSnap.id, ...roadmapSnap.data() } : null;
    } catch (error) {
      throw error;
    }
  },

  async getAllRoadmaps() {
    try {
      const roadmapsRef = collection(db, 'roadmaps');
      const roadmapsSnap = await getDocs(roadmapsRef);
      return roadmapsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  async getRoadmapsByCategory(category) {
    try {
      const roadmapsRef = collection(db, 'roadmaps');
      const q = query(
        roadmapsRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const roadmapsSnap = await getDocs(q);
      return roadmapsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  async updateRoadmap(roadmapId, roadmapData) {
    try {
      const roadmapRef = doc(db, 'roadmaps', roadmapId);
      await updateDoc(roadmapRef, {
        ...roadmapData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteRoadmap(roadmapId) {
    try {
      const roadmapRef = doc(db, 'roadmaps', roadmapId);
      await deleteDoc(roadmapRef);
    } catch (error) {
      throw error;
    }
  },

  async enrollUser(roadmapId, userId) {
    try {
      const roadmapRef = doc(db, 'roadmaps', roadmapId);
      await updateDoc(roadmapRef, {
        enrolledUsers: arrayUnion(userId),
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async unenrollUser(roadmapId, userId) {
    try {
      const roadmapRef = doc(db, 'roadmaps', roadmapId);
      await updateDoc(roadmapRef, {
        enrolledUsers: arrayRemove(userId),
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  }
}; 