"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkflowStore } from "@/lib/workflow-store";
import { useRouter } from "next/navigation";

/* 🔹 ADDED */
import UseTemplateDialog from "@/components/workflow/templates-/UseTemplateDialog";
import { getuserTemplates } from "@/lib/api/templateApi";
import { scheduleEmail } from "@/lib/api/api";
import { toast } from "sonner";

interface EmailConfigModalProps {
  nodeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailConfigModal({
  nodeId,
  isOpen,
  onClose,
}: EmailConfigModalProps) {
  const { nodes, updateNode, edges } = useWorkflowStore();
  const node = nodes.find((n) => n.id === nodeId);
  const router = useRouter();

  const [senderEmail, setSenderEmail] = useState("");
  const [emailType, setEmailType] = useState("initial");
  const [body, setBody] = useState("");

  /* 🔹 ADDED */
  const [subject, setSubject] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string[]>([]);

  const [mode, setMode] = useState<"single" | "csv">("single");
  const [csvEmails, setCsvEmails] = useState<string[]>([]);
  const [csvError, setCsvError] = useState("");
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [singleEmail, setSingleEmail] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  useEffect(() => {
    async function fet() {
      const { data } = await getuserTemplates();
      console.log("Data", data);
    }
    fet();
  }, []);

  useEffect(() => {
    if (!node) return;

    const cfg = node.data?.config || {};
    setSenderName(cfg.senderName || "");
    setSenderEmail(cfg.senderEmail || "");
    setSingleEmail(cfg.singleEmail || "");
    setEmailType(cfg.emailType || "initial");
    setBody(cfg.body || "");
    setSubject(cfg.subject || "");
    setMode(cfg.mode || "single");
    setCsvEmails(cfg.csvEmails || []);
    setSelectedTemplate(cfg.template || null);
  }, [node]);

  /* ---------------- CSV HANDLING (UNCHANGED) ---------------- */

  const handleCsvUpload = async (file: File) => {
    setCsvError("");
    const text = await file.text();

    const emails = text
      .split(/\r?\n|,/)
      .map((e) => e.trim())
      .filter((e) => e && /\S+@\S+\.\S+/.test(e));

    if (emails.length === 0) {
      setCsvError("No valid emails found in CSV");
      return;
    }

    setCsvEmails(emails);
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    try {
      console.log(nodes, "ed", edges);

      updateNode(nodeId, {
        config: {
          senderEmail,
          emailType,
          body,
          subject,
          template: selectedTemplate,
          mode,
          senderName,
          singleEmail,
          ...(mode === "csv" ? { csvEmails } : {}),
        },
      });
      toast.success("Workflow created sucessfully");
      onClose();
    } catch (error) {
      console.log("err", error);
      toast.error("Error while creating workflow");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Email</DialogTitle>
        </DialogHeader>

        <div className=" ">
          {/* Sender */}
          <div className="">
            <Label>Sender Name</Label>
            <Input
              type="email"
              placeholder="John"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>
          <div className="">
            <Label>Sender Email</Label>
            <Input
              type="email"
              placeholder="sender@example.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>
          {/* Email Type */}
          <div className="">
            <Label>Email Type</Label>
            <Select
              value={emailType}
              onValueChange={setEmailType}
              defaultValue="initial">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial">Initial</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* 🔹 ADDED: Template Selection */}
          <div className="">
            <Label>Select Template</Label>
            <Select
              value={selectedTemplate || ""}
              onValueChange={(value) => {
                if (value === "__create__") {
                  router.push("/template/create_template");
                } else {
                  setSelectedTemplate(value);
                  setIsTemplateOpen(true);
                }
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose template" />
              </SelectTrigger>
              <SelectContent>
                {templateName.map((name, idx) => (
                  <SelectItem key={idx} value={name}>
                    {name}
                  </SelectItem>
                ))}
                <SelectItem value="__create__">
                  ➕ Create new template
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Mode */}
          <div className="">
            <Label>Recipients</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Email</SelectItem>
                <SelectItem value="csv">Upload CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Single Email */}
          {mode === "single" && (
            <div className="">
              <Label>Recipient Email</Label>
              <Input
                placeholder="user@example.com"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
              />
            </div>
          )}
          {/* CSV Upload */}
          {mode === "csv" && (
            <div className="space-y-1">
              <Label>Upload CSV (one email per row)</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  e.target.files && handleCsvUpload(e.target.files[0])
                }
              />
              {csvError && <p className="text-sm text-red-500">{csvError}</p>}
              {csvEmails.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {csvEmails.length} emails loaded
                </p>
              )}
            </div>
          )}
          {/* 🔹 ADDED: Template-driven body & subject */}
          <UseTemplateDialog
            open={isTemplateOpen}
            onOpenChange={setIsTemplateOpen}
            selectedType={selectedTemplate}
            setTemplateName={setTemplateName}
            onPreviewChange={(html, subjectLine) => {
              setBody(html);
              setSubject(subjectLine);
            }}
          />
          {/* Body (kept exactly as-is) */}
          <div className="">
            <Label>Email Body</Label>
            <Textarea
              placeholder="Enter email content…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={7}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
