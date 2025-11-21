// Firebase Service - Replace localStorage with Firestore
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { VocabUnit, Workspace, Language } from '../types';

const LANGUAGE_NAMES: { [key in Language]: string } = {
  japanese: '日本語',
  chinese: '中文',
  english: 'English',
};

// Helper function to retry Firestore operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.warn(`Operation failed (attempt ${i + 1}/${maxRetries}):`, error.message);
      
      // Don't retry auth errors
      if (error.code?.startsWith('auth/')) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}

// ============= AUTH FUNCTIONS =============

export async function registerUser(username: string, password: string): Promise<FirebaseUser> {
  try {
    // Convert username to email format for Firebase Auth
    const email = `${username.toLowerCase().trim()}@vocab.local`;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      username: username,
      email: email,
      createdAt: new Date().toISOString(),
      workspaces: [],
    });
    
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Tên người dùng đã tồn tại');
    }
    throw new Error(error.message);
  }
}

export async function loginUser(username: string, password: string): Promise<FirebaseUser> {
  try {
    // Convert username to email format
    const email = `${username.toLowerCase().trim()}@vocab.local`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error('Tên người dùng hoặc mật khẩu không đúng');
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export async function getCurrentUsername(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;
    
    return userDoc.data().username || null;
  } catch (error) {
    console.error('Error getting username:', error);
    return null;
  }
}

// ============= WORKSPACE FUNCTIONS =============

export async function createWorkspace(language: Language): Promise<Workspace> {
  const user = getCurrentUser();
  if (!user) throw new Error('No user logged in');
  
  console.log('[createWorkspace] Starting for language:', language);
  console.log('[createWorkspace] User:', user.uid, user.email);
  
  return retryOperation(async () => {
    const userRef = doc(db, 'users', user.uid);
    console.log('[createWorkspace] Getting user document...');
    
    const userDoc = await getDoc(userRef);
    console.log('[createWorkspace] User doc exists:', userDoc.exists());
    
    if (!userDoc.exists()) {
      console.log('[createWorkspace] Creating user document...');
      // Create user doc if not exists
      await setDoc(userRef, {
        username: user.email?.split('@')[0] || user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        workspaces: [],
      });
      console.log('[createWorkspace] User document created');
    }
    
    const userData = userDoc.exists() ? userDoc.data() : { workspaces: [] };
    const workspaces = userData.workspaces || [];
    console.log('[createWorkspace] Current workspaces:', workspaces.length);
    
    // Check if workspace for this language already exists
    if (workspaces.some((w: Workspace) => w.language === language)) {
      throw new Error('Workspace for this language already exists');
    }
    
    // Max 3 workspaces
    if (workspaces.length >= 3) {
      throw new Error('Maximum 3 workspaces allowed');
    }
    
    const workspace: Workspace = {
      id: `${language}-${Date.now()}`,
      language,
      name: LANGUAGE_NAMES[language],
      createdAt: new Date().toISOString(),
    };
    
    console.log('[createWorkspace] Creating workspace:', workspace.id);
    
    // Add workspace to user document
    console.log('[createWorkspace] Updating user document...');
    await updateDoc(userRef, {
      workspaces: arrayUnion(workspace)
    });
    console.log('[createWorkspace] User document updated');
    
    // Create workspace document
    console.log('[createWorkspace] Creating workspace document...');
    await setDoc(doc(db, 'workspaces', workspace.id), {
      userId: user.uid,
      language,
      name: workspace.name,
      createdAt: workspace.createdAt,
      units: []
    });
    console.log('[createWorkspace] Workspace document created successfully');
    
    return workspace;
  });
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
  const user = getCurrentUser();
  if (!user) return [];
  
  return retryOperation(async () => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create user doc if not exists
      await setDoc(userRef, {
        username: user.email?.split('@')[0] || user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        workspaces: [],
      });
      return [];
    }
    
    const userData = userDoc.data();
    return userData.workspaces || [];
  }, 3, 500).catch((error) => {
    console.error('Error getting workspaces:', error);
    return [];
  });
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('No user logged in');
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) throw new Error('User not found');
  
  const userData = userDoc.data();
  const workspaces = userData.workspaces || [];
  const workspaceToDelete = workspaces.find((w: Workspace) => w.id === workspaceId);
  
  if (!workspaceToDelete) throw new Error('Workspace not found');
  
  // Remove workspace from user document
  await updateDoc(userRef, {
    workspaces: arrayRemove(workspaceToDelete)
  });
  
  // Delete workspace document
  await deleteDoc(doc(db, 'workspaces', workspaceId));
}

// ============= UNITS FUNCTIONS =============

export async function getUnitsForWorkspace(workspaceId: string): Promise<VocabUnit[]> {
  const user = getCurrentUser();
  if (!user) return [];
  
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  const workspaceDoc = await getDoc(workspaceRef);
  
  if (!workspaceDoc.exists()) return [];
  
  const workspaceData = workspaceDoc.data();
  return workspaceData.units || [];
}

export async function saveUnitToWorkspace(workspaceId: string, unit: VocabUnit): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('No user logged in');
  
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  const workspaceDoc = await getDoc(workspaceRef);
  
  if (!workspaceDoc.exists()) throw new Error('Workspace not found');
  
  const workspaceData = workspaceDoc.data();
  const units = workspaceData.units || [];
  
  // Check if unit already exists (by fileName)
  const existingIndex = units.findIndex((u: VocabUnit) => u.fileName === unit.fileName);
  
  if (existingIndex >= 0) {
    // Update existing unit
    units[existingIndex] = unit;
  } else {
    // Add new unit
    units.push(unit);
  }
  
  await updateDoc(workspaceRef, { units });
}

export async function deleteUnitFromWorkspace(workspaceId: string, fileName: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('No user logged in');
  
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  const workspaceDoc = await getDoc(workspaceRef);
  
  if (!workspaceDoc.exists()) throw new Error('Workspace not found');
  
  const workspaceData = workspaceDoc.data();
  const units = workspaceData.units || [];
  
  const updatedUnits = units.filter((u: VocabUnit) => u.fileName !== fileName);
  
  await updateDoc(workspaceRef, { units: updatedUnits });
}

// ============= CURRENT WORKSPACE (in memory) =============
let currentWorkspaceId: string | null = null;

export function setCurrentWorkspace(workspaceId: string): void {
  currentWorkspaceId = workspaceId;
}

export function getCurrentWorkspace(): string | null {
  return currentWorkspaceId;
}

export function clearCurrentWorkspace(): void {
  currentWorkspaceId = null;
}
