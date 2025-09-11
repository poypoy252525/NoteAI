import { useState } from "react";
import RichTextEditor from "./rich-text-editor-wrapper";

const TestEditorOutput = () => {
  const [content, setContent] = useState("");

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Editor:</h2>
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Raw HTML Output:</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
          {content}
        </pre>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Rendered Preview:</h2>
        <div 
          className="border p-4 rounded"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default TestEditorOutput;
