'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { User } from '@/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          }
        } catch {
          // Firestore not reachable yet
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });

    const orgId = `org_${credential.user.uid}`;

    await setDoc(doc(db, 'organizations', orgId), {
      id: orgId,
      name: displayName,
      registrationNumber: '',
      taxNumber: '',
      ownerId: credential.user.uid,
      memberIds: [credential.user.uid],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      subscriptionTier: 'free',
      isActive: true,
    });

    await setDoc(doc(db, 'users', credential.user.uid), {
      uid: credential.user.uid,
      email,
      displayName,
      role: 'business_user',
      organizationId: orgId,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'agentConfigurations', orgId), {
      id: orgId,
      organizationId: orgId,
      globalMode: 'supervised',
      agents: {
        agent0_governance: { enabled: true },
        agent1_discovery: { enabled: true },
        agent2_matching: { enabled: true },
        agent3_intelligence: { enabled: true },
        agent4_readiness: { enabled: true },
      },
      notifications: {
        matchAlerts: true,
        closingReminders: true,
        documentExpiry: true,
        minMatchScore: 70,
        reminderDaysBefore: 7,
      },
      updatedAt: serverTimestamp(),
      updatedBy: credential.user.uid,
    });
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, signIn, signUp, logOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
