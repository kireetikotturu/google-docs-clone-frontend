import React, { useState, useEffect } from "react";
import TextEditor from "./components/TextEditor";
import { auth } from "./firebase";
import Login from "./Login";
import "./App.css"; // ✅ Import CSS file

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
    <div className="container">
      <h1>Store Letters</h1>
      {user ? (
        <>
          <button className="logout-btn" onClick={() => auth.signOut()}>Logout</button>
          <TextEditor onSave={handleSave} />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
