import { EditorContent, useEditor } from "@tiptap/react";
import { useState, useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import EditorToolbar from "./editor-toolbar";

const RichTextEditor = () => {
  const [, forceUpdate] = useState({});
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
    ],
    editorProps: {
      attributes: {
        class: "min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 border-t",
      },
    },
    content: "<p>Start writing your note...</p>",
    onUpdate: () => {
      // Force toolbar re-render when content changes
      forceUpdate({});
    },
    onSelectionUpdate: () => {
      // Force toolbar re-render when selection changes
      forceUpdate({});
    },
  });

  useEffect(() => {
    if (editor) {
      // Additional event listeners to ensure toolbar updates
      const handleTransaction = () => forceUpdate({});
      editor.on('transaction', handleTransaction);
      
      return () => {
        editor.off('transaction', handleTransaction);
      };
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-input rounded-md">
        <div className="p-4">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="border border-input rounded-md">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
