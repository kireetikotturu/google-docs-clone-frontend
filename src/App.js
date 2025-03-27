import React, { useState, useEffect } from "react";
import TextEditor from "./components/TextEditor";
import { auth, signInWithGoogle } from "./firebase";
import Login from "./Login";
import "./App.css"; // ✅ Import CSS file
function App() {
  const [user, setUser] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState(null);
  const [googleToken, setGoogleToken] = useState(null); // ✅ Store Google OAuth token

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        setFirebaseToken(token);
      } else {
        setUser(null);
        setFirebaseToken(null);
        setGoogleToken(null); // Reset Google token if user logs out
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const result = await signInWithGoogle();
    if (result?.googleToken) {
      setGoogleToken(result.googleToken); // Set the Google OAuth token
    }
  };

  const handleSave = async (content) => {
    if (!user || !firebaseToken || !googleToken) {
      alert("You must be logged in to save a letter!");
      return;
    }
    try {
      console.log("🔹 Sending Firebase Token:", firebaseToken);
      console.log("🔹 Sending Google OAuth Token:", googleToken); // Log Google token for debugging

      const response = await fetch("https://google-docs-clone-backend-h4q0.onrender.com/save-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({ letter: content, userToken: googleToken }), // Send Google OAuth token here
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
    <div className="container">
      <h1>Store Letters</h1>
      {user ? (
        <>
          <button className="logout-btn" onClick={() => auth.signOut()}>Logout</button>
          <TextEditor onSave={handleSave} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
