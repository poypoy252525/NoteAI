import { useEffect, forwardRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import EditorToolbar from "./editor-toolbar";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    { value = "", onChange, placeholder = "Start writing your note..." },
    ref
  ) => {
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
      content: value,
      editorProps: {
        attributes: {
          class:
            "min-h-[200px] max-h-[400px] w-full overflow-y-auto prose prose-sm max-w-none focus:outline-none p-4 border-t break-words",
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
    });

    // Update editor content when value prop changes
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    // Set initial placeholder
    useEffect(() => {
      if (editor && placeholder) {
        editor.extensionManager.extensions.forEach((extension) => {
          if (extension.name === "placeholder") {
            extension.options.placeholder = placeholder;
          }
        });
      }
    }, [editor, placeholder]);

    if (!editor) {
      return (
        <div className="border border-input rounded-md">
          <div className="p-4">Loading editor...</div>
        </div>
      );
    }

    return (
      <div ref={ref} className="border border-input rounded-md w-full overflow-hidden">
        <EditorToolbar editor={editor} />
        <div className="overflow-hidden">
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
