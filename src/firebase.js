import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut 
} from "firebase/auth";

// ✅ Your Firebase Config (replace with your actual credentials)
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

// ✅ Configure Google OAuth Provider
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.setCustomParameters({
  prompt: "select_account", // Forces user to always pick an account
});

// ✅ Function to Sign In with Google (Using Redirect)
const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, provider); // Use redirect instead of popup
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    alert("❌ Google Sign-In failed! Please check your Firebase configuration.");
  }
};

// ✅ Function to Handle Redirect Result (Call this on page load)
const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("✅ Google Sign-In Success:", result.user);
      return {
        user: result.user,
        googleToken: result.user.accessToken,
      };
    }
  } catch (error) {
    console.error("❌ Redirect Sign-In Error:", error);
  }
};

// ✅ Function to Logout the user
const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ Successfully logged out");
  } catch (error) {
    console.error("❌ Logout Error:", error);
  }
};

export { auth, signInWithGoogle, handleRedirectResult, logout };
