// components/RichTextEditor.tsx
"use client";

import React, { useMemo, useRef, forwardRef } from "react";
import dynamic from "next/dynamic";
import { Quill } from "react-quill-new";
import ImageResize from "quill-image-resize-module-react";
import { supabase } from "@/lib/supabaseClient";
import "react-quill-new/dist/quill.snow.css";

if (typeof window !== "undefined" && Quill) {
  try {
    const Parchment = Quill.import("parchment") as any;
    if (Parchment) {
      if (!Parchment.Attributor) Parchment.Attributor = {};
      if (!Parchment.Attributor.Style) {
        Parchment.Attributor.Style = Parchment.StyleAttributor || Parchment.ClassAttributor;
      }
    }
    Quill.register("modules/imageResize", ImageResize);
  } catch (e) {}
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return forwardRef((props: any, ref: any) => <RQ ref={ref} {...props} />);
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-48 w-full bg-slate-50 animate-pulse rounded-md flex items-center justify-center text-xs text-slate-400">
        Đang nạp trình soạn thảo văn bản...
      </div>
    ),
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  bucketFolder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung chi tiết...",
  bucketFolder = "editor-images",
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${bucketFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("vjourney-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("vjourney-images")
          .getPublicUrl(filePath);

        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection();
          editor.insertEmbed(range ? range.index : 0, "image", data.publicUrl);
        }
      } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        alert("Không thể chèn ảnh, vui lòng kiểm tra kết nối!");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          // 🚀 BỔ SUNG NÚT THỤT LỀ (INDENT / OUTDENT) THAY THẾ CHO THANH RULER WORD
          [{ indent: "-1" }, { indent: "+1" }], 
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-slate-300 shadow-xs">
      <ReactQuillBase
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}