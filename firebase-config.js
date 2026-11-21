const firebaseConfig = {
  apiKey: "AIzaSyCxKH-w9Kn3vlmvil0QDQrT10JxMp7kF6E",
  authDomain: "fix-system-11931.firebaseapp.com",
  projectId: "fix-system-11931",
  storageBucket: "fix-system-11931.firebasestorage.app",
  messagingSenderId: "608105526844",
  appId: "1:608105526844:web:c6271e9462f64906017539",
  measurementId: "G-N68Y7SY680"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const USERS_MAP = {
  "ahmed shaheen": { email: "ahmedshaheen@shop.local", passSuffix: "123", name: "أحمد شاهين", role: "tech" },
  "amr ataallah":  { email: "amrataallah@shop.local",  passSuffix: "123", name: "عمرو عطاالله", role: "tech" },
  "beyti bee":     { email: "beytibee@shop.local",     passSuffix: "123", name: "يوسف أيمن", role: "reception" },
  "admin":         { email: "admin@shop.local",         passSuffix: "123", name: "عمرو عطاالله (إدارة)", role: "admin" }
};

function loginWithUsername(usernameInput, passwordInput) {
  const cleanUser = usernameInput.trim().toLowerCase();
  const userObj = USERS_MAP[cleanUser];
  if (!userObj) {
    return Promise.reject(new Error("اسم المستخدم غير صحيح"));
  }
  return auth.signInWithEmailAndPassword(userObj.email, passwordInput + userObj.passSuffix);
}