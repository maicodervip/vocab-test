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
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return null;
  
  return userDoc.data().username || null;
}

// ============= WORKSPACE FUNCTIONS =============

export async function createWorkspace(language: Language): Promise<Workspace> {
  const user = getCurrentUser();
  if (!user) throw new Error('No user logged in');
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User document not found');
  }
  
  const userData = userDoc.data();
  const workspaces = userData.workspaces || [];
  
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
  
  // Add workspace to user document
  await updateDoc(userRef, {
    workspaces: arrayUnion(workspace)
  });
  
  // Create workspace document
  await setDoc(doc(db, 'workspaces', workspace.id), {
    userId: user.uid,
    language,
    name: workspace.name,
    createdAt: workspace.createdAt,
    units: []
  });
  
  return workspace;
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
  const user = getCurrentUser();
  if (!user) return [];
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return [];
  
  const userData = userDoc.data();
  return userData.workspaces || [];
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
