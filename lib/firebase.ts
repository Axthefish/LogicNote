import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDeMT_ULlao2mhFv-h3GsSOzvw04bUkzbU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "logicnotev1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "logicnotev1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "logicnotev1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "136034258149",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:136034258149:web:98db023629caf93fbc180c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-D5EM17RE29"
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  console.error('Firebase configuration is missing required fields');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics (only in browser and production)
export const initializeAnalytics = async () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    const analyticsIsSupported = await isSupported();
    if (analyticsIsSupported) {
      return getAnalytics(app);
    }
  }
  return null;
};

// Connect to emulators if in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines when using Firebase emulators
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Function URLs configuration
const IS_LOCAL_DEV = process.env.NODE_ENV === 'development';
const LOCAL_API_BASE_URL = 'http://127.0.0.1:5001/logicnotev1/us-central1';
const PROD_API_BASE_URL = 'https://us-central1-logicnotev1.cloudfunctions.net';

export const BASE_URL = IS_LOCAL_DEV ? LOCAL_API_BASE_URL : PROD_API_BASE_URL;

// Centralized Function URLs
export const FUNCTION_URLS = {
  ANALYZE_TEXT_URL: `${BASE_URL}/analyzeTextToGraph`,
  UPDATE_NODE_LABEL_URL: `${BASE_URL}/updateNodeLabel`,
  UPDATE_NODE_DETAILS_URL: `${BASE_URL}/updateNodeDetails`,
  UPDATE_GRAPH_URL: `${BASE_URL}/updateGraph`,
  CREATE_KNOWLEDGE_SYSTEM_URL: `${BASE_URL}/createKnowledgeSystem`,
  LIST_KNOWLEDGE_SYSTEMS_URL: `${BASE_URL}/listKnowledgeSystems`,
  ASSIGN_GRAPH_TO_SYSTEM_URL: `${BASE_URL}/assignGraphToSystem`,
  LIST_GRAPHS_BY_SYSTEM_URL: `${BASE_URL}/listGraphsBySystem`,
  GET_GRAPH_URL: `${BASE_URL}/getGraph`,
  CREATE_GOAL_URL: `${BASE_URL}/createGoal`,
  LIST_GOALS_URL: `${BASE_URL}/listGoals`,
  UPDATE_GOAL_URL: `${BASE_URL}/updateGoal`,
  DELETE_GOAL_URL: `${BASE_URL}/deleteGoal`,
  SAVE_TEXT_URL: `${BASE_URL}/saveText`,
  LIST_SAVED_TEXTS_URL: `${BASE_URL}/listSavedTexts`,
  DELETE_TEXT_URL: `${BASE_URL}/deleteText`,
  LIST_ALL_GRAPHS_URL: `${BASE_URL}/listAllGraphs`
};

// Node Styling Configurations
export const NODE_SIZES = {
  LEVEL1: 70,
  LEVEL1_ALT: 55,
  LEVEL2: 40,
  LEVEL3: 40,
  LEVEL4: 30,
  DEFAULT: 30
};

export const NODE_COLORS = {
  核心概念: '#1890ff',
  主要方面L1: '#52c41a',
  相关细节L2: '#faad14',
  其他L3以上: '#bfbfbf',
  USER_IMPORTANCE_HIGHLIGHT: '#FFD700'
};

// Edge Styling Configurations
export const EDGE_STYLES = {
  '因果关系': { stroke: '#E91E63', lineDash: null },
  '条件关系': { stroke: '#FF9800', lineDash: null },
  '层级/从属关系': { stroke: '#2196F3', lineDash: null },
  '对比/对立关系': { stroke: '#9C27B0', lineDash: [5, 5] },
  '并列/选择关系': { stroke: '#4CAF50', lineDash: [2, 2] },
  '解释/阐述关系': { stroke: '#00BCD4', lineDash: null },
  '手段/目的关系': { stroke: '#8BC34A', lineDash: null },
  '时序关系': { stroke: '#FFC107', lineDash: null },
  '依赖/支撑关系': { stroke: '#CDDC39', lineDash: null },
  '一般关联': { stroke: '#9E9E9E', lineDash: [10, 5] },
  DEFAULT: { stroke: '#9E9E9E', lineDash: null }
};

export default app; 