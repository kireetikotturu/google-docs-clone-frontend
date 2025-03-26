import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCm1YB7wUZL15nB7PyrLjpqpJVVeN21-40",
  authDomain: "warrentyme1.firebaseapp.com",
  projectId: "warrentyme1",
  storageBucket: "warrentyme1.appspot.com",
  messagingSenderId: "647689769280",
  appId: "1:647689769280:web:4be22177ba3ece2bfe6aa5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Configure Google OAuth Provider (Prevents Popup Issues)
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive.file");

// ✅ Function to Sign In with Google & Handle Errors
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) throw new Error("No credentials returned from Google");

    const googleAccessToken = credential.accessToken; // ✅ Correct Google OAuth Token
    console.log("✅ Google Access Token:", googleAccessToken);
    
    return { user: result.user, googleToken: googleAccessToken };
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    alert("❌ Google Sign-In failed! Make sure pop-ups are allowed.");
    return null;
  }
};

// ✅ Function to Logout
const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ Successfully logged out");
  } catch (error) {
    console.error("❌ Logout Error:", error);
  }
};

export { auth, signInWithGoogle, logout };
