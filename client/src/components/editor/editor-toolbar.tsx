import type { Editor } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  ChevronDown,
  Undo,
  Redo,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

const EditorToolbar = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  const headingItems = [
    {
      level: 0,
      label: "Paragraph",
      command: () => editor.chain().focus().setParagraph().run(),
    },
    {
      level: 1,
      label: "Heading 1",
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      level: 2,
      label: "Heading 2",
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      level: 3,
      label: "Heading 3",
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      level: 4,
      label: "Heading 4",
      command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      level: 5,
      label: "Heading 5",
      command: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      level: 6,
      label: "Heading 6",
      command: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Paragraph";
  };

  const handleAlignmentChange = (value: string) => {
    if (value === "left") {
      editor.chain().focus().setTextAlign("left").run();
    } else if (value === "center") {
      editor.chain().focus().setTextAlign("center").run();
    } else if (value === "right") {
      editor.chain().focus().setTextAlign("right").run();
    } else if (value === "justify") {
      editor.chain().focus().setTextAlign("justify").run();
    }
  };

  const getCurrentAlignment = () => {
    if (editor.isActive({ textAlign: "left" })) return "left";
    if (editor.isActive({ textAlign: "center" })) return "center";
    if (editor.isActive({ textAlign: "right" })) return "right";
    if (editor.isActive({ textAlign: "justify" })) return "justify";
    return "left";
  };

  return (
    <div className="bg-background rounded-md p-2 flex flex-wrap items-center gap-2">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Headings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            {getCurrentHeading()}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {headingItems.map((item) => (
            <DropdownMenuItem
              key={item.level}
              onClick={item.command}
              className={
                item.level === 0
                  ? editor.isActive("paragraph")
                    ? "bg-accent"
                    : ""
                  : editor.isActive("heading", { level: item.level })
                  ? "bg-accent"
                  : ""
              }
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Toggle>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Text Alignment */}
      <ToggleGroup
        type="single"
        value={getCurrentAlignment()}
        onValueChange={handleAlignmentChange}
        size="sm"
      >
        <ToggleGroupItem value="left">
          <AlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center">
          <AlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right">
          <AlignRight className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify">
          <AlignJustify className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="w-px h-6 bg-border" />

      {/* Lists and Quote */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
};

export default EditorToolbar;
