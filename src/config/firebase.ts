import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBWyNhRk9GJ57cW-dNqe_o4ZeN-D62YJQA',
  authDomain: 'candlemaster.app',
  projectId: 'candle-master-d4bbd',
  storageBucket: 'candle-master-d4bbd.firebasestorage.app',
  messagingSenderId: '951460493496',
  appId: '1:951460493496:web:54d35c1d5f02a1778f9c4d',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
