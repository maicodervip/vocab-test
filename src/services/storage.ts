// Local Storage Service for managing users and vocab units
import { VocabUnit } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'vocab_current_user',
  USERS_DATA: 'vocab_users_data',
};

export interface UserData {
  username: string;
  password: string;
  units: VocabUnit[];
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

// Logout user
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
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

// Create new user
export function createUser(username: string, password: string): UserData {
  const allUsers = getAllUsersData();
  
  if (allUsers[username]) {
    throw new Error('User already exists');
  }
  
  // Simple hash (in production, use proper encryption)
  const hashedPassword = btoa(password); // Base64 encode
  
  allUsers[username] = {
    username,
    password: hashedPassword,
    units: [],
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
  return allUsers[username] || null;
}

// Save units for current user
export function saveUnitsForCurrentUser(units: VocabUnit[]): void {
  const username = getCurrentUser();
  if (!username) return;
  
  const allUsers = getAllUsersData();
  if (allUsers[username]) {
    allUsers[username].units = units;
    saveAllUsersData(allUsers);
  }
}

// Get units for current user
export function getUnitsForCurrentUser(): VocabUnit[] {
  const userData = getCurrentUserData();
  return userData?.units || [];
}

// Delete a unit for current user
export function deleteUnitForCurrentUser(fileName: string): void {
  const username = getCurrentUser();
  if (!username) return;
  
  const allUsers = getAllUsersData();
  if (allUsers[username]) {
    allUsers[username].units = allUsers[username].units.filter(
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
