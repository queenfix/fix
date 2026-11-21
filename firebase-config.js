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

const TECH_CONTACTS = {
  "amrataallah@shop.local": { displayName: "عمرو عطاالله", phone: "01223739286" },
  "ahmedshaheen@shop.local": { displayName: "أحمد شاهين", phone: "01119910492" },
  "beytibee@shop.local": { displayName: "أحمد شاهين", phone: "01119910492" }
};

function getCustomerTechInfo(ticketData) {
  if (ticketData.techEmail && TECH_CONTACTS[ticketData.techEmail]) {
    return TECH_CONTACTS[ticketData.techEmail];
  }
  if (ticketData.techName && ticketData.techName.includes("عمرو")) {
    return { displayName: "عمرو عطاالله", phone: "01223739286" };
  }
  return { displayName: "أحمد شاهين", phone: "01119910492" };
}

function loginWithUsername(usernameInput, passwordInput) {
  const cleanUser = usernameInput.trim().toLowerCase();
  const userObj = USERS_MAP[cleanUser];
  if (!userObj) {
    return Promise.reject(new Error("اسم المستخدم غير صحيح"));
  }
  return auth.signInWithEmailAndPassword(userObj.email, passwordInput + userObj.passSuffix);
}

function getReminderCycle(createdAt) {
  if (!createdAt || !createdAt.toDate) return 0;
  const diffDays = Math.floor((Date.now() - createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return 0;
  return Math.floor(diffDays / 7);
}

function triggerNewDeviceNotification(ticketData) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("جهاز جديد للصيانة: " + ticketData.deviceType, {
      body: "العميل: " + ticketData.customerName + " | العطل: " + ticketData.issue,
      icon: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
    });
  }
}

function readImageAsCompressedBase64(file, callback) {
  if (!file) {
    callback("");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const maxW = 600;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.65));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}