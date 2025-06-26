export function shareContent({ title, text, url }) {
  if (navigator.share) {
    navigator
      .share({ title, text, url })
      .then(() => console.log("Chia sẻ thành công"))
      .catch((error) => console.error("Lỗi chia sẻ:", error));
  } else {
    alert("Trình duyệt không hỗ trợ chia sẻ trực tiếp.");
  }
}
