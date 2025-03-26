import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ onSave }) => {
  const [letter, setLetter] = useState("");
  const quillRef = useRef(null); // ✅ Use ref instead of findDOMNode

  const handleSave = () => {
    if (onSave) {
      onSave(letter);
    }
  };

  return (
    <div>
      <ReactQuill 
        ref={quillRef} // ✅ Use ref here to avoid findDOMNode
        value={letter} 
        onChange={setLetter} 
      />
      <button onClick={handleSave}>Save Letter</button>
    </div>
  );
};

export default TextEditor;
