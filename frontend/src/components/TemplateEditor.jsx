import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { saveTemplate } from "../api/templateApi";

export default function TemplateEditor() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [variables, setVariables] = useState([]);
  const [previewValues, setPreviewValues] = useState({});
  const quillRef = useRef(null);

  // Extract variables from content
  useEffect(() => {
    const matches = content.match(/{{(.*?)}}/g);
    if (!matches) return setVariables([]);
    const uniqueVars = [...new Set(matches.map(v => v.replace(/[{}]/g, "")))];
    setVariables(uniqueVars);

    // Set default values for preview
    const defaultPreview = {};
    uniqueVars.forEach((v) => {
      defaultPreview[v] = previewValues[v] || "";
    });
    setPreviewValues(defaultPreview);
  }, [content]);

  const insertVariable = (variable) => {
    const editor = quillRef.current?.getEditor();
    const range = editor?.getSelection(true);
    if (range) {
      editor.insertText(range.index, `{{${variable}}}`, "user");
    }
  };

  const renderPreview = () => {
    let rendered = content;
    Object.entries(previewValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      rendered = rendered.replace(regex, value || "");
    });
    return rendered;
  };

  const handleSave = async () => {
    const payload = {
      title,
      subject,
      html: content,
    };
    try {
      const { data } = await saveTemplate(payload);
      alert("Template saved successfully!");
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Error saving template");
    }
  };

  return (
    <div className="flex gap-6 bg-white p-6 rounded-xl shadow-lg h-full w-full ">
      {/* Sidebar */}
      <div className="w-1/4">
        <div className="bg-gray-100 p-4 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold mb-3">Insert Variables</h2>
          {variables.length === 0 ? (
            <p className="text-sm text-gray-500">No variables yet</p>
          ) : (
            <ul className="space-y-2">
              {variables.map((v) => (
                <li
                  key={v}
                  onClick={() => insertVariable(v)}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {`{{${v}}}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="w-3/4 space-y-6">
        {/* Title & Subject */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Template Title"
            className="p-3 border rounded-lg text-lg font-medium shadow-sm"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email Subject"
            className="p-3 border rounded-lg text-lg shadow-sm"
          />
        </div>

        {/* React Quill Editor */}
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          className="h-[300px]"
        />

        {/* Variable Preview Inputs */}
        {variables.length > 0 && (
          <div className="grid grid-cols-2 gap-4 ">
            {variables.map((v) => (
              <div key={v} className="flex flex-col">
                <label className="text-sm font-medium capitalize mb-1">{v}</label>
                <input
                  type="text"
                  value={previewValues[v] || ""}
                  onChange={(e) =>
                    setPreviewValues((prev) => ({ ...prev, [v]: e.target.value }))
                  }
                  className="p-2 border rounded-md"
                />
              </div>
            ))}
          </div>
        )}

        {/* Live Preview */}
        <div className="p-4 border rounded-xl bg-gray-50 shadow-inner  " style={{marginTop:"55px"}}>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Live Preview</h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
          />
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
