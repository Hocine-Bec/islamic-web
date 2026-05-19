"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all duration-150 ${
        active
          ? "bg-green-600/10 text-green-700"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-gray-200 mx-0.5 self-center" />;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        active={editor.isActive("bold")}
        title="عريض"
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        active={editor.isActive("italic")}
        title="مائل"
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
        active={editor.isActive("underline")}
        title="تسطير"
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        active={editor.isActive("strike")}
        title="يتوسطه خط"
      >
        <Strikethrough size={15} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
        active={editor.isActive("heading", { level: 1 })}
        title="عنوان 1"
      >
        <Heading1 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        active={editor.isActive("heading", { level: 2 })}
        title="عنوان 2"
      >
        <Heading2 size={15} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("right").run(); }}
        active={editor.isActive({ textAlign: "right" })}
        title="محاذاة لليمين"
      >
        <AlignRight size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("center").run(); }}
        active={editor.isActive({ textAlign: "center" })}
        title="محاذاة للوسط"
      >
        <AlignCenter size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("left").run(); }}
        active={editor.isActive({ textAlign: "left" })}
        title="محاذاة لليسار"
      >
        <AlignLeft size={15} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        active={editor.isActive("bulletList")}
        title="قائمة نقطية"
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        active={editor.isActive("orderedList")}
        title="قائمة رقمية"
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        active={editor.isActive("blockquote")}
        title="اقتباس"
      >
        <Quote size={15} />
      </ToolbarButton>

      <div className="flex-1" />

      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        disabled={!editor.can().undo()}
        title="تراجع"
      >
        <Undo size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        disabled={!editor.can().redo()}
        title="إعادة"
      >
        <Redo size={15} />
      </ToolbarButton>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "right",
      }),
      Placeholder.configure({
        placeholder: placeholder || "اكتب هنا...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        className:
          "focus:outline-none min-h-[450px] px-5 py-4 text-gray-700 leading-relaxed",
        dir: "rtl",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="rounded-2xl bg-white overflow-hidden">
      <MenuBar editor={editor} />
      <div className="h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent" />
      <EditorContent editor={editor} />
    </div>
  );
}