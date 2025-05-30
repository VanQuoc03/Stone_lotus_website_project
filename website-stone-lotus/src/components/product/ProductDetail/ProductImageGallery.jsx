import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageGallery({ images = [] }) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrev(e);
      } else if (e.key === "ArrowRight") {
        handleNext(e);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, activeImage]);

  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);
  if (images.length === 0) {
    return <div className="bg-gray-100 h-96 rounded-lg" />;
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setTransitioning(true);
    setTimeout(() => {
      const currentIndex = images.indexOf(activeImage);
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      setActiveImage(images[prevIndex]);
      setTransitioning(false);
    }, 200);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setTransitioning(true);
    setTimeout(() => {
      const currentIndex = images.indexOf(activeImage);
      const nextIndex = (currentIndex + 1) % images.length;
      setActiveImage(images[nextIndex]);
      setTransitioning(false);
    }, 200);
  };
  return (
    <div className="space-y-4">
      {/* Ảnh lớn với hiệu ứng zoom và mở lightbox */}
      <div
        className="w-full h-96 border rounded-lg overflow-hidden group relative cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={activeImage?.image_url || activeImage}
          alt="Ảnh sản phẩm"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Danh sách ảnh nhỏ */}
      <div className="flex gap-3 overflow-x-auto">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.image_url || img}
            alt={`Ảnh ${index + 1}`}
            onClick={() => setActiveImage(img)}
            className={`w-20 h-20 rounded border cursor-pointer object-cover transition-all duration-200 hover:scale-105 ${
              activeImage === img
                ? "border-[#c29e6b] border-2"
                : "border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="absolute top-6 right-6 text-white hover:text-gray-300"
          >
            <X size={28} />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-6 text-white hover:text-gray-300"
          >
            <ChevronLeft size={32} />
          </button>

          <img
            src={activeImage?.image_url || activeImage}
            alt="Ảnh phóng to"
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              transitioning ? "opacity-0" : "opacity-100"
            }`}
          />

          <button
            onClick={handleNext}
            className="absolute right-6 text-white hover:text-gray-300"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
