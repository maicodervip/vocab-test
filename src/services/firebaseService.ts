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
  if (!user) {
    alert('LỖI: Không có user đăng nhập');
    throw new Error('No user logged in');
  }
  
  console.log('[createWorkspace] Starting for language:', language);
  console.log('[createWorkspace] User:', user.uid, user.email);
  
  const userRef = doc(db, 'users', user.uid);
  
  try {
    // Get or create user document
    console.log('[createWorkspace] Getting user document...');
    alert('Bước 1: Đang lấy user document...');
    
    let userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('[createWorkspace] User doc not found, creating...');
      alert('Bước 2: User doc không tồn tại, đang tạo...');
      
      const newUserData = {
        username: user.email?.split('@')[0] || user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        workspaces: [],
      };
      await setDoc(userRef, newUserData);
      console.log('[createWorkspace] User document created');
      alert('Bước 2: Đã tạo user document');
      
      // Re-fetch to confirm
      userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        alert('LỖI: Không thể tạo user document');
        throw new Error('Failed to create user document');
      }
    } else {
      alert('Bước 1: Đã có user document');
    }
    
    const userData = userDoc.data();
    const workspaces = userData.workspaces || [];
    console.log('[createWorkspace] Current workspaces:', workspaces.length);
    alert('Bước 3: Số workspace hiện tại: ' + workspaces.length);
    
    // Check if workspace for this language already exists
    if (workspaces.some((w: Workspace) => w.language === language)) {
      alert('LỖI: Workspace cho ngôn ngữ này đã tồn tại');
      throw new Error('Không gian học tập cho ngôn ngữ này đã tồn tại');
    }
    
    // Max 3 workspaces
    if (workspaces.length >= 3) {
      alert('LỖI: Đã đủ 3 workspace');
      throw new Error('Tối đa 3 không gian học tập');
    }
    
    const workspace: Workspace = {
      id: `${language}-${Date.now()}`,
      language,
      name: LANGUAGE_NAMES[language],
      createdAt: new Date().toISOString(),
    };
    
    console.log('[createWorkspace] Creating workspace:', workspace.id);
    alert('Bước 4: Đang cập nhật user document với workspace: ' + workspace.id);
    
    // Update user document with new workspace
    const updatedWorkspaces = [...workspaces, workspace];
    await updateDoc(userRef, {
      workspaces: updatedWorkspaces
    });
    console.log('[createWorkspace] User document updated');
    alert('Bước 5: Đã cập nhật user document');
    
    // Create workspace document
    alert('Bước 6: Đang tạo workspace document...');
    await setDoc(doc(db, 'workspaces', workspace.id), {
      userId: user.uid,
      language,
      name: workspace.name,
      createdAt: workspace.createdAt,
      units: []
    });
    console.log('[createWorkspace] Workspace document created successfully');
    alert('Bước 7: Tạo workspace document thành công!');
    
    return workspace;
  } catch (error: any) {
    console.error('[createWorkspace] Error:', error);
    alert('LỖI CUỐI CÙNG:\nMessage: ' + error.message + '\nCode: ' + error.code + '\nName: ' + error.name);
    throw error;
  }
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
  const user = getCurrentUser();
  if (!user) return [];
  
  try {
    const userRef = doc(db, 'users', user.uid);
    let userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create user doc if not exists
      console.log('[getUserWorkspaces] Creating user document...');
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
  } catch (error) {
    console.error('[getUserWorkspaces] Error:', error);
    return [];
  }
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
