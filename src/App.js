import React, { useState, useEffect } from "react";
import TextEditor from "./components/TextEditor";
import { auth, signInWithGoogle } from "./firebase"; // ✅ Import Firebase Auth
import Login from "./Login"; // ✅ Import Login Page

function App() {
  const [user, setUser] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // ✅ Get Google OAuth Token from User
        const token = await user.getIdToken();
        setGoogleToken(token);
      } else {
        setUser(null);
        setGoogleToken(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        setUser(result.user);
        const token = await result.user.getIdToken();
        setGoogleToken(token);
      }
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      alert("❌ Google authentication failed! Please try again.");
    }
  };

  const handleSave = async (content) => {
    if (!user || !googleToken) {
      alert("You must be logged in to save a letter!");
      return;
    }

    try {
      const firebaseToken = await user.getIdToken();

      console.log("🔹 Sending Google OAuth token:", googleToken); // 🔥 Debugging log

      const response = await fetch("http://localhost:5001/save-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`, // ✅ Firebase auth token
        },
        body: JSON.stringify({ letter: content, userToken: googleToken }), // ✅ Send Google OAuth token
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Letter saved successfully!");
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error saving letter:", error);
      alert("❌ Error saving letter");
    }
  };

  return (
    <div>
      <h1>Google Docs Clone</h1>
      {user ? (
        <>
          <button onClick={() => auth.signOut()}>Logout</button> {/* ✅ Logout Button */}
          <TextEditor onSave={handleSave} />
        </>
      ) : (
        <>
          <button onClick={handleLogin}>Sign in with Google</button>
          <Login />
        </>
      )}
    </div>
  );
}

export default App;
