import React, { useState, useEffect } from "react";
import TextEditor from "./components/TextEditor";
import { auth, signInWithGoogle } from "./firebase"; // ✅ Import Corrected Firebase Auth
import Login from "./Login"; // ✅ Import Login Page

function App() {
  const [savedLetter, setSavedLetter] = useState("");
  const [user, setUser] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // ✅ Ensure Google OAuth Token is Retrieved
        const signInResult = await signInWithGoogle();
        if (signInResult && signInResult.googleToken) {
          setGoogleToken(signInResult.googleToken);
        } else {
          console.error("❌ Failed to get Google OAuth token");
          alert("❌ Google authentication failed! Try again.");
        }
      } else {
        setUser(null);
        setGoogleToken(null);
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleSave = async (content) => {
    if (!user || !googleToken) {
      alert("You must be logged in to save a letter!");
      return;
    }

    try {
      const firebaseToken = await user.getIdToken(); // Firebase Auth Token

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

  // 🔹 Show Login Page if User is NOT Signed In
  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <h1>Google Docs Clone</h1>
      <button onClick={() => auth.signOut()}>Logout</button> {/* ✅ Logout Button */}
      <TextEditor onSave={handleSave} />
      {savedLetter && (
        <div>
          <h2>Saved Letter</h2>
          <div dangerouslySetInnerHTML={{ __html: savedLetter }} />
        </div>
      )}
    </div>
  );
}

export default App;
