import api from "./axiosInstance";

export async function uploadImages(files) {
  if (!files || files.length === 0) {
    return [];
  }
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  try {
    const res = await api.post("/api/upload/multiple", formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.imageUrls || [];
  } catch (err) {
    console.error("lỗi upload ảnh", err);
    throw new Error("Upload ảnh thất bại");
  }
}
