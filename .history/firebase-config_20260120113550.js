// Firebase Configuration
// ⚠️ SUBSTITUA OS VALORES ABAIXO COM SUAS CREDENCIAIS DO FIREBASE
// Acesse console.firebase.google.com para criar um projeto e copiar as credenciais

const firebaseConfig = {
    apiKey: "SEU_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-messaging-id",
    appId: "seu-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Services
const db = firebase.firestore();
const storage = firebase.storage();

console.log('✅ Firebase iniciado com sucesso!');
