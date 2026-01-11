"use client";

import { useEffect, useRef, useState } from "react";

import { saveTemplate } from "@/lib/api/templateApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type PreviewValues = Record<string, string>;

export default function TemplateEditor() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [variables, setVariables] = useState<string[]>([]);
  const [previewValues, setPreviewValues] = useState<PreviewValues>({});
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      HorizontalRule,
      HardBreak,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  /* ---------------- Extract variables ---------------- */

  const openLinkPopup = () => {
    const previousUrl = editor?.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setIsLinkOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;

    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }

    setIsLinkOpen(false);
    setLinkUrl("");
  };
  useEffect(() => {
    const matches = content.match(/{{(.*?)}}/g);
    if (!matches) {
      setVariables([]);
      setPreviewValues({});
      return;
    }

    const uniqueVars = [...new Set(matches.map((v) => v.replace(/[{}]/g, "")))];
    setVariables(uniqueVars);

    const defaults: PreviewValues = {};
    uniqueVars.forEach((v) => {
      defaults[v] = previewValues[v] || "";
    });

    setPreviewValues(defaults);
  }, [content]);

  /* ---------------- Insert variable ---------------- */

  const insertVariable = (variable: string) => {
    editor?.chain().focus().insertContent(`{{${variable}}}`).run();
  };

  /* ---------------- Render preview ---------------- */

  const renderPreview = () => {
    let rendered = content;

    Object.entries(previewValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      rendered = rendered.replace(regex, value || "");
    });

    return rendered;
  };

  /* ---------------- Save ---------------- */

  const handleSave = async () => {
    try {
      await saveTemplate({
        title,
        subject,
        html: content,
      });

      toast.success("Workflow created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while saving workflow");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full min-h-screen p-2 sm:p-4">
      {/* ---------- SIDEBAR ---------- */}
      <Card className="lg:w-1/4 lg:sticky lg:top-4 h-fit">
        <CardHeader>
          <CardTitle className="text-base">Insert Variables</CardTitle>
        </CardHeader>

        <CardContent>
          {variables.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No variables found yet
            </p>
          ) : (
            <ul className="space-y-2 max-h-[40vh] overflow-auto pr-1">
              {variables.map((v) => (
                <li
                  key={v}
                  onClick={() => insertVariable(v)}
                  className="cursor-pointer rounded-md px-3 py-1 text-sm bg-muted hover:bg-muted/70 transition">
                  {`{{${v}}}`}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ---------- MAIN ---------- */}
      <div className="flex-1 space-y-4">
        {/* Title & Subject */}
        <Card>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Template Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Template title"
              />
            </div>

            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card>
          <CardContent className="pt-4 space-y-2">
            {/* Toolbar */}
            <EditorToolbar editor={editor} onLinkClick={openLinkPopup} />

            {/* Editor */}
            <div className="border rounded-md">
              <EditorContent
                editor={editor}
                className="tiptap-editor min-h-[300px] sm:min-h-[360px] p-4 sm:p-5 text-[15px] leading-relaxed focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Variable Inputs */}
        {variables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Variable Preview Values
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variables.map((v) => (
                <div key={v} className="space-y-1">
                  <Label className="capitalize">{v}</Label>
                  <Input
                    value={previewValues[v] || ""}
                    onChange={(e) =>
                      setPreviewValues((prev) => ({
                        ...prev,
                        [v]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live Preview</CardTitle>
          </CardHeader>

          <CardContent>
            <div
              className="prose max-w-none border-t pt-4"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Template</Button>
        </div>
      </div>
      <Dialog open={isLinkOpen} onOpenChange={setIsLinkOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                editor?.chain().focus().unsetLink().run();
                setIsLinkOpen(false);
              }}>
              Remove
            </Button>

            <Button onClick={applyLink}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function EditorToolbar({
  editor,
  onLinkClick,
}: {
  editor: any;
  onLinkClick: () => void;
}) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 border-b px-2 py-2 bg-muted/40 rounded-t-md">
      {/* Text styles */}
      <Button
        size="sm"
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}>
        B
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        I
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("underline") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}>
        U
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <Button
        size="sm"
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "outline"
        }
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }>
        H1
      </Button>

      <Button
        size="sm"
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "outline"
        }
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }>
        H2
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Extras */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        ―
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }>
        Clear
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("link") ? "default" : "outline"}
        onClick={onLinkClick}>
        🔗
      </Button>
    </div>
  );
}
