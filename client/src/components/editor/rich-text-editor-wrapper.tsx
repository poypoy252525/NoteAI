import { useEffect, forwardRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
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
        StarterKit.configure({
          heading: false, // We'll use the separate Heading extension
          paragraph: {
            HTMLAttributes: {
              class: null,
            },
          },
        }),
        Heading.configure({
          levels: [1, 2, 3, 4, 5, 6],
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Underline,
        TextStyle,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-primary underline cursor-pointer',
          },
        }),
        Placeholder.configure({
          placeholder: placeholder,
          emptyEditorClass: 'is-editor-empty',
        }),
        TaskList.configure({
          HTMLAttributes: {
            class: 'prose-task-list',
          },
        }),
        TaskItem.configure({
          nested: true,
          HTMLAttributes: {
            class: 'prose-task-item',
          },
        }),
        Highlight.configure({
          multicolor: true,
        }),
        Color,
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        Typography,
        Subscript,
        Superscript,
      ],
      content: value,
      editorProps: {
        attributes: {
          class:
            "min-h-[200px] max-h-[400px] w-full overflow-y-auto prose prose-sm prose-slate dark:prose-invert max-w-none focus:outline-none p-4 border-t break-words " +
            "prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm " +
            "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 " +
            "prose-strong:font-bold prose-em:italic " +
            "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic " +
            "prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        },
        handlePaste: () => {
          // Allow default paste behavior to preserve formatting
          return false;
        },
        transformPastedHTML: (html) => {
          // Clean up pasted HTML while preserving important formatting
          return html;
        },
        transformPastedText: (text) => {
          // Keep text as is to preserve formatting when pasting
          return text;
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);
      },
      autofocus: false,
      editable: true,
    });

    // Update editor content when value prop changes
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    // Clean up on unmount
    useEffect(() => {
      return () => {
        editor?.destroy();
      };
    }, [editor]);

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
