import React, { useState, useEffect } from "react";
import TextEditor from "./components/TextEditor";
import { auth, signInWithGoogle } from "./firebase"; // ✅ Import Firebase Auth
import Login from "./Login"; // ✅ Import Login Page

function App() {
  const [user, setUser] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        setFirebaseToken(token);
      } else {
        setUser(null);
        setFirebaseToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        setUser(result.user);
        const token = await result.user.getIdToken();
        setFirebaseToken(token);
      }
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      alert("❌ Google authentication failed! Please try again.");
    }
  };

  const handleSave = async (content) => {
    if (!user || !firebaseToken) {
      alert("You must be logged in to save a letter!");
      return;
    }
    try {
      console.log("🔹 Sending Firebase Token:", firebaseToken);
      const response = await fetch("https://google-docs-clone-backend-h4q0.onrender.com/save-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({ letter: content }),
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
          <button onClick={() => auth.signOut()}>Logout</button>
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
