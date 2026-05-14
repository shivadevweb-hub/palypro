import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toy, Plan, PLANS, TOYS } from './data/mockData';
import { 
  auth, db, handleFirestoreError, OperationType, signInWithGoogle 
} from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  currentPlanId?: string;
  selectedToyIds: string[];
  address?: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  toyIds: string[];
  toyNames: string[];
  status: 'pending' | 'delivered' | 'swapped';
  shippingAddress: string;
  phone: string;
  createdAt: any;
  deliveryDate?: any;
  expiryDate?: any;
}

interface PlayContextType {
  user: User | null;
  login: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  toys: Toy[];
  orders: Order[];
  currentPlan: Plan | null;
  setPlan: (plan: Plan) => Promise<void>;
  updateUserAddress: (name: string, address: string, phone: string) => Promise<void>;
  selectedToys: Toy[];
  toggleToySelection: (toy: Toy) => Promise<void>;
  clearSelection: () => Promise<void>;
  placeOrder: () => Promise<void>;
  markOrderAsDelivered: (orderId: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
  addToy: (toy: Partial<Toy>) => Promise<void>;
  updateToy: (toy: Toy) => Promise<void>;
  deleteToy: (id: string) => Promise<void>;
  isLoading: boolean;
  dbStatus: 'connected' | 'disconnected' | 'connecting';
}

const PlayContext = createContext<PlayContextType | undefined>(undefined);

export const PlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [toys, setToys] = useState<Toy[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [selectedToys, setSelectedToys] = useState<Toy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  // Test connection on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDoc(doc(db, 'test', 'connection'));
        setDbStatus('connected');
        console.log("🔥 Firebase: Connected");
      } catch (error: any) {
        console.warn("⚠️ Firebase: Connection check failed:", error.code, error.message);
        if (error.code === 'permission-denied' || error.code === 'not-found' || error.code === 'failed-precondition') {
          setDbStatus('connected');
        } else if (error.message?.includes('offline')) {
          console.log("ℹ️ Firebase: Operating in offline mode");
          setDbStatus('connected');
        } else {
          setDbStatus('disconnected');
        }
      }
    }
    testConnection();
  }, []);

  // Sync Auth State & Profile
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Auth state changed: User signed in", firebaseUser.email);
        const profileRef = doc(db, 'users', firebaseUser.uid);
        
        try {
          // 1. Initial admin check
          const adminEmails = [
            'adminplaypro@gmail.com',
            'admin@playpro.com',
            'shivadevweb@gmail.com'
          ];
          let isAdmin = adminEmails.includes(firebaseUser.email?.toLowerCase() || '');
          
          // 2. Initial profile check/creation
          let profileSnap;
          try {
            profileSnap = await getDoc(profileRef);
          } catch (e) {
            console.error("Initial profile fetch failed", e);
          }

          const profileData = {
            email: firebaseUser.email?.toLowerCase() || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL || '',
            isAdmin: isAdmin,
            selectedToyIds: profileSnap?.exists() ? (profileSnap.data()?.selectedToyIds || []) : [],
            updatedAt: new Date().toISOString()
          };

          if (!profileSnap || !profileSnap.exists()) {
            console.log("Creating new user profile in Firestore...");
            try {
              await setDoc(profileRef, {
                ...profileData,
                createdAt: new Date().toISOString()
              });
            } catch (e) {
              console.error("Profile creation failed", e);
            }
          } else {
            // Check if we need to sync admin status
            const existingData = profileSnap.data();
            if (existingData?.isAdmin !== isAdmin) {
              console.log("Syncing admin status for existing profile...");
              try {
                await updateDoc(profileRef, { 
                  isAdmin: isAdmin,
                  updatedAt: new Date().toISOString()
                });
              } catch (e) {
                console.warn("Profile admin sync failed", e.message);
              }
            }
          }

          // 3. Setup real-time listener for profile sync
          unsubscribeProfile = onSnapshot(profileRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: data.name || 'User',
                isAdmin: data.isAdmin || false,
                currentPlanId: data.currentPlanId,
                selectedToyIds: data.selectedToyIds || [],
                address: data.address,
                phone: data.phone
              });

              if (data.currentPlanId) {
                const plan = PLANS.find(p => p.id === data.currentPlanId);
                setCurrentPlan(plan || null);
              }
            } else {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: profileData.name,
                isAdmin: isAdmin,
                selectedToyIds: [],
              });
            }
            setIsLoading(false);
          }, (err) => {
            console.error("Profile snapshot error", err);
            setIsLoading(false);
          });

        } catch (error) {
          console.error("Critical identity sync error:", error);
          setIsLoading(false);
        }
      } else {
        console.log("Auth state changed: User signed out");
        if (unsubscribeProfile) unsubscribeProfile();
        setUser(null);
        setCurrentPlan(null);
        setSelectedToys([]);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) (unsubscribeProfile as any)();
    };
  }, []);

  // Fetch Toys Real-time
  useEffect(() => {
    if (dbStatus === 'disconnected') {
      import('./data/mockData').then(({ TOYS }) => setToys(TOYS));
      return;
    }

    let unmounted = false;
    const fetchToys = async () => {
      try {
        const q = query(collection(db, 'toys'), orderBy('name'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (unmounted) return;
          const toysData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Toy[];
          setToys(toysData);
        }, (error) => {
          if (unmounted) return;
          console.warn("Firestore Toys fetch failed:", error.message);
        });

        return unsubscribe;
      } catch (e) {
        return () => {};
      }
    };

    const unsubscribePromise = fetchToys();
    return () => {
      unmounted = true;
      unsubscribePromise.then(u => u && u());
    };
  }, [dbStatus]);

  // Fetch Orders Real-time
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      if (user.isAdmin) {
        setOrders(ordersData);
      } else {
        setOrders(ordersData.filter(o => o.userId === user.id));
      }
    }, (error) => {
      console.warn("Order fetch warning:", error.message);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync Selected Toys
  useEffect(() => {
    if (user && toys.length > 0) {
      const selected = toys.filter(t => user.selectedToyIds.includes(t.id));
      setSelectedToys(selected);
    } else {
      setSelectedToys([]);
    }
  }, [user?.selectedToyIds, toys]);

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found') {
        throw new Error("Google Sign-In is not enabled for this project yet.");
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error("Login popup was blocked.");
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@playpro.com';
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPass) {
      setUser({
        id: 'manual-admin-id',
        email: adminEmail,
        name: 'System Admin',
        isAdmin: true,
        selectedToyIds: [],
      });
      return { error: null };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName: name });
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      setUser(null);
    }
    setCurrentPlan(null);
    setSelectedToys([]);
  };

  const setPlan = async (plan: Plan) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.id);
    try {
      await updateDoc(profileRef, { 
        currentPlanId: plan.id, 
        selectedToyIds: [] 
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const updateUserAddress = async (name: string, address: string, phone: string) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.id);
    try {
      await updateDoc(profileRef, { name, address, phone });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const toggleToySelection = async (toy: Toy) => {
    if (!user || !currentPlan) return;
    
    let newToyIds: string[];
    const isSelected = user.selectedToyIds.includes(toy.id);

    if (isSelected) {
      newToyIds = user.selectedToyIds.filter(id => id !== toy.id);
    } else {
      if (user.selectedToyIds.length >= currentPlan.toyCount) return;
      newToyIds = [...user.selectedToyIds, toy.id];
    }

    const profileRef = doc(db, 'users', user.id);
    try {
      await updateDoc(profileRef, { selectedToyIds: newToyIds });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const clearSelection = async () => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.id);
    try {
      await updateDoc(profileRef, { selectedToyIds: [] });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const placeOrder = async () => {
    if (!user || selectedToys.length === 0) return;
    if (!user.address || !user.phone) throw new Error("Shipping address and phone required");

    const orderData = {
      userId: user.id,
      userName: user.name,
      toyIds: selectedToys.map(t => t.id),
      toyNames: selectedToys.map(t => t.name),
      status: 'pending',
      shippingAddress: user.address,
      phone: user.phone,
      createdAt: new Date().toISOString()
    };

    try {
      const ordersRef = collection(db, 'orders');
      await setDoc(doc(ordersRef, Math.random().toString(36).substr(2, 9)), orderData);
      await clearSelection();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  const seedDatabase = async () => {
    const { TOYS: mockToys } = await import('./data/mockData');
    for (const toy of mockToys) {
      await addToy(toy);
    }
  };

  const markOrderAsDelivered = async (orderId: string) => {
    const now = new Date().toISOString();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, {
        status: 'delivered',
        deliveryDate: now,
        expiryDate: expiry.toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const addToy = async (toy: Partial<Toy>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToy = {
      ...toy,
      id: id,
      available: toy.available ?? true,
      createdAt: new Date().toISOString()
    } as Toy;

    try {
      const { id: _, ...dataToSave } = newToy;
      await setDoc(doc(db, 'toys', id), dataToSave);
    } catch (error) {
      console.warn("Firestore add failed:", error);
    }
  };

  const updateToy = async (toy: Toy) => {
    const { id, ...data } = toy;
    const toyRef = doc(db, 'toys', id);
    try {
      await updateDoc(toyRef, data);
    } catch (error) {
      console.warn("Firestore update failed:", error);
    }
  };

  const deleteToy = async (id: string) => {
    const toyRef = doc(db, 'toys', id);
    try {
      await deleteDoc(toyRef);
    } catch (error) {
      console.warn("Firestore delete failed:", error);
    }
  };

  return (
    <PlayContext.Provider value={{
      user, login, signInWithEmail, signUpWithEmail, logout, toys, orders, currentPlan, setPlan,
      updateUserAddress, selectedToys, toggleToySelection, clearSelection, 
      placeOrder, markOrderAsDelivered, seedDatabase,
      addToy, updateToy, deleteToy, isLoading, dbStatus
    }}>
      {children}
    </PlayContext.Provider>
  );
};

export const usePlay = () => {
  const context = useContext(PlayContext);
  if (context === undefined) {
    throw new Error('usePlay must be used within a PlayProvider');
  }
  return context;
};
