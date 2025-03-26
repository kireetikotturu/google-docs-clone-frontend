import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = () => {
  const [content, setContent] = useState("");

  return (
    <div>
      <h2>Letter Editor</h2>
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={() => console.log(content)}>Save Draft</button>
    </div>
  );
};

export default Editor;
