"use client";

import React, { useEffect, useState } from "react";
import { getuserTemplates } from "@/lib/api/templateApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ---------------- TYPES ---------------- */

type Template = {
  title: string;
  subject: string;
  content: string;
};

type UseTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedType: string | null;
  onPreviewChange: (html: string, subject: string) => void;
  setTemplateName: (names: string[]) => void;
};

type VariableMap = Record<string, string>;

/* ---------------- COMPONENT ---------------- */

export default function UseTemplateDialog({
  open,
  onOpenChange,
  selectedType,
  onPreviewChange,
  setTemplateName,
}: UseTemplateDialogProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [variableValues, setVariableValues] = useState<VariableMap>({});
  const [preview, setPreview] = useState("");

  /* ---------------- FETCH TEMPLATES ---------------- */

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await getuserTemplates();
        const list: Template[] = data?.data ?? [];
        setTemplates(list);
        setTemplateName(list.map((t) => t.title));
      } catch (error) {
        console.error("Failed to load templates", error);
      }
    };

    fetchTemplates();
  }, [setTemplateName]);

  /* ---------------- SELECT TEMPLATE ---------------- */

  useEffect(() => {
    if (!selectedType || templates.length === 0) return;

    const template = templates.find((t) => t.title === selectedType);
    if (!template) return;

    setSelectedTemplate(template);

    const variables = extractVariables(template.content);
    const initialValues: VariableMap = {};
    variables.forEach((v) => (initialValues[v] = ""));
    setVariableValues(initialValues);
  }, [selectedType, templates]);

  /* ---------------- VARIABLE EXTRACTION ---------------- */

  const extractVariables = (html: string): string[] => {
    const matches = html.match(/{{(.*?)}}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))];
  };

  /* ---------------- PREVIEW UPDATE ---------------- */

  useEffect(() => {
    if (!selectedTemplate) return;

    let updatedHtml = selectedTemplate.content;

    Object.entries(variableValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      updatedHtml = updatedHtml.replace(regex, value);
    });

    setPreview(updatedHtml);
    onPreviewChange(updatedHtml, selectedTemplate.subject);
  }, [variableValues, selectedTemplate, onPreviewChange]);

  /* ---------------- HANDLERS ---------------- */

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Use Email Template</DialogTitle>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="py-12 text-center text-muted-foreground">
            No template selected
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[70vh]">
            {/* ---------------- VARIABLES ---------------- */}
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <h3 className="font-semibold mb-3">Fill Variables</h3>

                <ScrollArea className="h-[calc(100%-32px)] pr-2">
                  <div className="space-y-3">
                    {Object.keys(variableValues).map((key) => (
                      <div key={key} className="space-y-1">
                        <Label className="capitalize">{key}</Label>
                        <Input
                          value={variableValues[key]}
                          onChange={(e) =>
                            handleVariableChange(key, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* ---------------- PREVIEW ---------------- */}
            <Card className="h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <h3 className="font-semibold mb-1">Email Preview</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Subject:{" "}
                  <span className="font-medium">
                    {selectedTemplate.subject}
                  </span>
                </p>

                <ScrollArea className="flex-1 border-t pt-3">
                  <div
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
