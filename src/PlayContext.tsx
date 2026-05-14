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
  getDocFromServer,
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  addDoc,
  deleteDoc
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
  addToy: (toy: Partial<Toy>) => Promise<void>;
  updateToy: (toy: Toy) => Promise<void>;
  deleteToy: (id: string) => Promise<void>;
  isLoading: boolean;
  dbStatus: 'connected' | 'disconnected' | 'connecting';
}

const PlayContext = createContext<PlayContextType | undefined>(undefined);

export const PlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [toys, setToys] = useState<Toy[]>(TOYS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [selectedToys, setSelectedToys] = useState<Toy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  // Test connection on boot
  useEffect(() => {
    async function testConnection() {
      try {
        // Use getDoc instead of getDocFromServer for a smoother experience
        // Even if the document doesn't exist, as long as it doesn't throw a connection error, we're good
        await getDoc(doc(db, 'test', 'connection'));
        setDbStatus('connected');
        console.log("🔥 Firebase: Connected");
      } catch (error: any) {
        console.warn("⚠️ Firebase: Connection check failed:", error.code, error.message);
        
        // These codes mean we are connected, but permissions or other factors blocked the specific read
        if (error.code === 'permission-denied' || error.code === 'not-found' || error.code === 'failed-precondition') {
          setDbStatus('connected');
        } else if (error.message?.includes('offline')) {
          // If offline, we might be in a restricted environment (like an iframe)
          // We'll fallback to connected but log it
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
            'shivadevweb@gmail.com' // Developer admin
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
              // If profile doesn't exist yet but we just created it, snap might be empty at first
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
        // If we are NOT a firebase user, check if we are a manual admin
        if (user?.id === 'manual-admin-id') {
          console.log("Manual Admin is still active");
          setIsLoading(false);
          return;
        }
        
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
  }, [user?.id === 'manual-admin-id']);

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
          
          // If we are connected to DB, we use DB data (even if empty)
          setToys(toysData);
        }, (error) => {
          if (unmounted) return;
          console.warn("Firestore Toys fetch failed, using local library:", error.message);
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

  // Fetch Orders Real-time (Admin sees all, User sees own)
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const ordersRef = collection(db, 'orders');
    // For simplicity, we filter in memory if not admin, but ideally we use a firestore query
    // Since we secured it in rules, user can only read their own if not admin
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
      // Users might get permission error on 'list' if not admin and trying to list all
      // But firestore list rules should allow it if we filter on client and rules enforce index-like security
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
        throw new Error("Google Sign-In is not enabled for this project yet. Please ask the developer to enable it in the Firebase Console.");
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error("Login popup was blocked. Please allow popups for this site and try again.");
      }
      console.error("Google sign-in error", err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    // Manual Admin Login Bypass (for Demo/Review)
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@playpro.com';
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'adminPassword123';

    if (email === adminEmail && password === adminPass) {
      console.log("⚡ Success: Manual Admin Login Triggered");
      setUser({
        id: 'manual-admin-id',
        email: adminEmail,
        name: 'PlayPro Admin',
        isAdmin: true,
        selectedToyIds: [],
      });
      return { error: null };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err: any) {
      // If we are disconnected, give a helpful hint
      if (dbStatus === 'disconnected') {
        return { error: new Error("Database is in Demo Mode. Try using the default admin credentials shared by the system.") };
      }
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
    await signOut(auth);
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
      setUser(prev => prev ? { ...prev, selectedToyIds: newToyIds } : null);
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
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      await clearSelection();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  const seedDatabase = async () => {
    if (!user?.isAdmin) return;
    const { TOYS: mockToys } = await import('./data/mockData');
    
    // Clear current local toys if we're connected to show a fresh sync
    if (dbStatus === 'connected') {
      setToys([]);
    }

    for (const toy of mockToys) {
      await addToy(toy);
    }
  };

  const markOrderAsDelivered = async (orderId: string) => {
    if (!user?.isAdmin) return;
    
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 30); // Default 30 days play time

    if (dbStatus === 'disconnected' || user?.id === 'manual-admin-id') {
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'delivered',
        deliveryDate: now,
        expiryDate: expiry
      } : o));
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, {
        status: 'delivered',
        deliveryDate: now,
        expiryDate: expiry
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const addToy = async (toy: Partial<Toy>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToyData = {
      ...toy,
      id: id,
      available: toy.available ?? true,
      createdAt: new Date().toISOString()
    } as Toy;

    // Optimistic Update
    setToys(prev => [newToyData, ...prev]);

    try {
      if (dbStatus === 'connected') {
        const { id: _, ...dataToSave } = newToyData; // Don't save ID in doc body twice if ID is doc name
        await setDoc(doc(db, 'toys', id), dataToSave);
        console.log("Toy saved to Firestore:", id);
        return;
      }
    } catch (error) {
      console.warn("Firestore add failed, kept local state:", error);
    }
  };

  const updateToy = async (toy: Toy) => {
    // Optimistic Update
    setToys(prev => prev.map(t => t.id === toy.id ? toy : t));

    const { id, ...data } = toy;
    const toyRef = doc(db, 'toys', id);
    try {
      if (dbStatus === 'connected') {
        await updateDoc(toyRef, data);
        console.log("Toy updated in Firestore:", id);
        return;
      }
    } catch (error) {
      console.warn("Firestore update failed, kept local state:", error);
    }
  };

  const deleteToy = async (id: string) => {
    // Optimistic Update
    setToys(prev => prev.filter(t => t.id !== id));

    const toyRef = doc(db, 'toys', id);
    try {
      if (dbStatus === 'connected') {
        await deleteDoc(toyRef);
        console.log("Toy deleted from Firestore:", id);
        return;
      }
    } catch (error) {
      console.warn("Firestore delete failed, kept local state:", error);
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
