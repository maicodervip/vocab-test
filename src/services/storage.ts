// Local Storage Service for managing users and vocab units
import { VocabUnit, Workspace, Language } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'vocab_current_user',
  CURRENT_WORKSPACE: 'vocab_current_workspace',
  USERS_DATA: 'vocab_users_data',
};

export interface UserData {
  username: string;
  password: string;
  workspaces: Workspace[];
  units: { [workspaceId: string]: VocabUnit[] };
  createdAt: string;
}

export interface UsersStorage {
  [username: string]: UserData;
}

// Get current logged in user
export function getCurrentUser(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
}

// Set current user
export function setCurrentUser(username: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
}

// Get current workspace
export function getCurrentWorkspace(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_WORKSPACE);
}

// Set current workspace
export function setCurrentWorkspace(workspaceId: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_WORKSPACE, workspaceId);
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKSPACE);
}

// Get all users data
function getAllUsersData(): UsersStorage {
  const data = localStorage.getItem(STORAGE_KEYS.USERS_DATA);
  return data ? JSON.parse(data) : {};
}

// Save all users data
function saveAllUsersData(data: UsersStorage): void {
  localStorage.setItem(STORAGE_KEYS.USERS_DATA, JSON.stringify(data));
}

const LANGUAGE_NAMES: { [key in Language]: string } = {
  japanese: '日本語',
  chinese: '中文',
  english: 'English',
};

// Create new user
export function createUser(username: string, password: string): UserData {
  const allUsers = getAllUsersData();
  
  if (allUsers[username]) {
    throw new Error('User already exists');
  }
  
  const hashedPassword = btoa(password);
  
  allUsers[username] = {
    username,
    password: hashedPassword,
    workspaces: [],
    units: {},
    createdAt: new Date().toISOString(),
  };
  saveAllUsersData(allUsers);
  setCurrentUser(username);
  return allUsers[username];
}

// Login user
export function loginUser(username: string, password: string): UserData | null {
  const allUsers = getAllUsersData();
  const user = allUsers[username];
  
  if (!user) {
    return null;
  }
  
  const hashedPassword = btoa(password);
  if (user.password !== hashedPassword) {
    return null;
  }
  
  setCurrentUser(username);
  return user;
}

// Check if user exists
export function userExists(username: string): boolean {
  const allUsers = getAllUsersData();
  return !!allUsers[username];
}

// Get current user's data
export function getCurrentUserData(): UserData | null {
  const username = getCurrentUser();
  if (!username) return null;
  
  const allUsers = getAllUsersData();
  const userData = allUsers[username];
  
  // Migration: Convert old data structure to new workspace structure
  if (userData && (!userData.workspaces || !Array.isArray(userData.workspaces))) {
    userData.workspaces = [];
    userData.units = {};
    saveAllUsersData(allUsers);
  }
  
  return userData || null;
}

// Create workspace
export function createWorkspace(language: Language): Workspace {
  const username = getCurrentUser();
  if (!username) throw new Error('No user logged in');
  
  const allUsers = getAllUsersData();
  const user = allUsers[username];
  
  if (!user) throw new Error('User not found');
  
  // Check if workspace for this language already exists
  if (user.workspaces.some(w => w.language === language)) {
    throw new Error('Workspace for this language already exists');
  }
  
  // Max 3 workspaces
  if (user.workspaces.length >= 3) {
    throw new Error('Maximum 3 workspaces allowed');
  }
  
  const workspace: Workspace = {
    id: `${language}-${Date.now()}`,
    language,
    name: LANGUAGE_NAMES[language],
    createdAt: new Date().toISOString(),
  };
  
  user.workspaces.push(workspace);
  user.units[workspace.id] = [];
  saveAllUsersData(allUsers);
  
  return workspace;
}

// Get all workspaces for current user
export function getUserWorkspaces(): Workspace[] {
  const userData = getCurrentUserData();
  return userData?.workspaces || [];
}

// Delete workspace
export function deleteWorkspace(workspaceId: string): void {
  const username = getCurrentUser();
  if (!username) return;
  
  const allUsers = getAllUsersData();
  if (allUsers[username]) {
    allUsers[username].workspaces = allUsers[username].workspaces.filter(
      w => w.id !== workspaceId
    );
    delete allUsers[username].units[workspaceId];
    saveAllUsersData(allUsers);
    
    if (getCurrentWorkspace() === workspaceId) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKSPACE);
    }
  }
}

// Save units for current workspace
export function saveUnitsForCurrentWorkspace(units: VocabUnit[]): void {
  const username = getCurrentUser();
  const workspaceId = getCurrentWorkspace();
  if (!username || !workspaceId) return;
  
  const allUsers = getAllUsersData();
  if (allUsers[username]) {
    allUsers[username].units[workspaceId] = units;
    saveAllUsersData(allUsers);
  }
}

// Get units for current workspace
export function getUnitsForCurrentWorkspace(): VocabUnit[] {
  const userData = getCurrentUserData();
  const workspaceId = getCurrentWorkspace();
  if (!userData || !workspaceId) return [];
  
  return userData.units[workspaceId] || [];
}

// Delete a unit for current workspace
export function deleteUnitForCurrentWorkspace(fileName: string): void {
  const username = getCurrentUser();
  const workspaceId = getCurrentWorkspace();
  if (!username || !workspaceId) return;
  
  const allUsers = getAllUsersData();
  if (allUsers[username] && allUsers[username].units[workspaceId]) {
    allUsers[username].units[workspaceId] = allUsers[username].units[workspaceId].filter(
      unit => unit.fileName !== fileName
    );
    saveAllUsersData(allUsers);
  }
}

// Get all usernames
export function getAllUsernames(): string[] {
  const allUsers = getAllUsersData();
  return Object.keys(allUsers);
}

// Delete user account
export function deleteUser(username: string): void {
  const allUsers = getAllUsersData();
  delete allUsers[username];
  saveAllUsersData(allUsers);
  
  if (getCurrentUser() === username) {
    logoutUser();
  }
}
