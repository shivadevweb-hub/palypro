import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toy, Plan, PLANS } from './data/mockData';
import { 
  auth, db, handleFirestoreError, OperationType 
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
        await getDocFromServer(doc(db, 'test', 'connection'));
        setDbStatus('connected');
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
          setDbStatus('disconnected');
        } else {
          // It might fail because the document doesn't exist, which is fine, means we are connected
          setDbStatus('connected');
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
        const adminRef = doc(db, 'admins', firebaseUser.uid);
        
        try {
          // 1. Initial admin check
          let isAdmin = firebaseUser.email === 'adminplaypro@gmail.com';
          if (!isAdmin) {
            try {
              const adminSnap = await getDoc(adminRef);
              isAdmin = adminSnap.exists();
            } catch (e) {
              console.warn("Could not verify admin status from collection", e);
            }
          }

          // 2. Initial profile check/creation
          let profileSnap;
          try {
            profileSnap = await getDoc(profileRef);
          } catch (e) {
            console.error("Initial profile fetch failed", e);
            // If the profile fetch fails, we might be a new user (bootstrap admin)
            // We'll proceed to check if we can create it
          }

          if (!profileSnap || !profileSnap.exists()) {
            console.log("Creating new user profile...");
            const profileData = {
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              isAdmin: isAdmin,
              selectedToyIds: [],
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(profileRef, profileData);
            } catch (e) {
              console.error("Profile creation failed", e);
              // If creation fails, we might really have a permission issue
              handleFirestoreError(e, OperationType.WRITE, `users/${firebaseUser.uid}`);
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
    const q = query(collection(db, 'toys'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const toysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Toy[];
      setToys(toysData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'toys');
    });

    return () => unsubscribe();
  }, []);

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
      const { signInWithGoogle } = await import('./lib/firebase');
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google sign-in failed", err);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
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
    const { TOYS } = await import('./data/mockData');
    for (const toy of TOYS) {
      await addToy(toy);
    }
  };

  const markOrderAsDelivered = async (orderId: string) => {
    if (!user?.isAdmin) return;
    const orderRef = doc(db, 'orders', orderId);
    
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 30); // Default 30 days play time

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
    try {
      await addDoc(collection(db, 'toys'), toy);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'toys');
    }
  };

  const updateToy = async (toy: Toy) => {
    const { id, ...data } = toy;
    const toyRef = doc(db, 'toys', id);
    try {
      await updateDoc(toyRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `toys/${id}`);
    }
  };

  const deleteToy = async (id: string) => {
    const toyRef = doc(db, 'toys', id);
    try {
      await deleteDoc(toyRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `toys/${id}`);
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
