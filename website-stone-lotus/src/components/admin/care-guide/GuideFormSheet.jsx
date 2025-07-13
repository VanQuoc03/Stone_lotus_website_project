import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function GuideFormSheet({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
  onFileUpload,
  isEditing,
  isUploading,
}) {
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const handleContentChange = (value) => {
    onChange({ target: { name: "content", value } });
  };

  const imageUrl =
    form.images && form.images.length > 0 ? form.images[0] : null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Chỉnh sửa Hướng dẫn" : "Tạo Hướng dẫn mới"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Cập nhật thông tin chi tiết cho hướng dẫn này."
              : "Điền vào biểu mẫu dưới đây để tạo một hướng dẫn chăm sóc mới."}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={onSubmit}
          className="flex-grow overflow-y-auto pr-6 space-y-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Ví dụ: Cách chăm sóc cây kim tiền"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Loại/Chủ đề</Label>
            <Input
              id="type"
              name="type"
              value={form.type}
              onChange={onChange}
              placeholder="Ví dụ: Cây trong nhà"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Thời gian đọc (phút)
            </label>
            <Input
              type="number"
              name="readTime"
              value={form.readTime}
              onChange={(e) => {
                const value = e.target.value;
                // Chỉ chấp nhận số >= 0 hoặc rỗng (nếu muốn cho phép xóa)
                if (
                  value === "" ||
                  (Number(value) >= 0 && Number.isInteger(+value))
                ) {
                  onChange(e);
                }
              }}
              placeholder="VD: 3"
              min={1}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Nội dung</Label>
            <div className="bg-white rounded-md">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={handleContentChange}
                modules={quillModules}
                className="h-64"
              />
            </div>
          </div>
          <div className="grid gap-2 pt-14">
            <Label htmlFor="image-upload">Ảnh đại diện</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              className="w-full"
            />
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Xem trước ảnh"
                  className="h-32 w-auto object-cover rounded-md border p-1"
                />
              </div>
            )}
          </div>
        </form>
        <SheetFooter className="mt-auto pt-4 border-t">
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </SheetClose>
          <Button type="submit" onClick={onSubmit} disabled={isUploading}>
            {isUploading
              ? "Đang tải ảnh..."
              : isEditing
              ? "Lưu thay đổi"
              : "Tạo mới"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
