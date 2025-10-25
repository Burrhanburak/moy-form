"use client";
import React, { useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface UploaderButtonProps {
  onClientUploadComplete?: (files: { url?: string; ufsUrl?: string }[]) => void;
  endpoint?: string;
  defaultImages?: string[]; // 🔹 dışarıdan başlangıç verisi
  onChange?: (urls: string[]) => void; // 🔹 değişiklikleri dışarı bildir
}

export default function UploaderButton({
  onClientUploadComplete,
  endpoint = "imageUploader",
  defaultImages = [],
  onChange,
}: UploaderButtonProps) {
  const [imageData, setImageData] = React.useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tempImages, setTempImages] = React.useState<string[]>([]);
  const MAX_IMAGES = 5;

  // ✅ Sadece ilk mount'ta localStorage'dan oku
  useEffect(() => {
    const saved = localStorage.getItem("uploaded_images");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setImageData(parsed);
      } catch (error) {
        console.error("Failed to parse saved images:", error);
      }
    }
  }, []); // Sadece ilk mount'ta

  // ✅ imageData değişince localStorage'a kaydet ve parent'a bildir
  useEffect(() => {
    if (imageData.length > 0 || imageData.length === 0) {
      localStorage.setItem("uploaded_images", JSON.stringify(imageData));
      onChange?.(imageData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]); // Sadece imageData değişince

  // ✅ İlk yükleme
  const handleInitialUpload = (files: { url?: string; ufsUrl?: string }[]) => {
    const totalCount = imageData.length + files.length;
    if (totalCount > MAX_IMAGES) {
      toast.error(`You can upload up to ${MAX_IMAGES} images only.`);
      return;
    }
    const newUrls = files.map((file) => file.ufsUrl || file.url || "");
    const updated = [...imageData, ...newUrls];
    setImageData(updated);
    onClientUploadComplete?.(files);
    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  // ✅ AlertDialog içi geçici yükleme
  const handleTempUpload = (files: { url?: string; ufsUrl?: string }[]) => {
    const totalCount = tempImages.length + files.length;
    if (totalCount > MAX_IMAGES) {
      toast.error(`You can upload up to ${MAX_IMAGES} images only.`);
      return;
    }
    const newUrls = files.map((file) => file.ufsUrl || file.url || "");
    setTempImages((prev) => [...prev, ...newUrls]);
    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  // ✅ Görselleri değiştir
  const confirmReplaceImages = () => {
    setImageData(tempImages);
    setTempImages([]);
    setDialogOpen(false);
    toast.success("Images replaced successfully!");
  };

  // ✅ Görsel sil
  const removeImage = (index: number) => {
    setImageData((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed successfully!");
  };

  // ✅ Tüm görselleri temizle
  const clearAllImages = () => {
    setImageData([]);
    toast.success("All images cleared!");
  };

  return (
    <main className="flex items-center justify-center bg-transparent">
      <div className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-[#313131] rounded-xl p-4 transition-colors">
        <div className="space-y-3">
          {/* Header */}
          {imageData.length > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-black dark:text-white text-sm">
                {imageData.length} image(s) uploaded
              </span>

              <div className="flex items-center justify-center gap-2">
                {/* Yeniden Yükle */}
                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="py-1 px-3 text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-sm"
                    >
                      Yeniden Yükle
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-[#1c1c1c] p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setDialogOpen(false)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                      aria-label="Kapat"
                    >
                      <X size={18} />
                    </button>

                    <AlertDialogHeader>
                      <AlertDialogTitle>Yeni görseller yükle</AlertDialogTitle>
                      <AlertDialogDescription>
                        En fazla {MAX_IMAGES} görsel yükleyebilirsin. Yükleme
                        tamamlanınca “Değiştir” butonuna bas.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Upload alanı */}
                    <UploadDropzone
                      className="mt-3 rounded-xl ut-button:bg-white ut-button:text-black ut-button:hover:bg-gray-100 ut-label:text-black ut-allowed-content:text-gray-600 ut-upload-icon:text-black ut-uploading:ut-button:hidden"
                      endpoint={endpoint as any}
                      onClientUploadComplete={handleTempUpload}
                      config={{ mode: "auto" }}
                      appearance={{
                        container:
                          "bg-white dark:bg-zinc-950 border border-gray-300 dark:border-[#313131] rounded-xl",
                        button:
                          "bg-white text-black dark:bg-zinc-950 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1c1c1c] border border-gray-300 dark:border-[#313131] transition-colors",
                        label: "text-black dark:text-white",
                        allowedContent: "text-gray-600 dark:text-gray-400",
                        uploadIcon: "text-black dark:text-white",
                      }}
                    />

                    {tempImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {tempImages.map((url, index) => (
                          <Image
                            key={index}
                            src={url}
                            alt={`temp ${index}`}
                            width={300}
                            height={200}
                            className="object-cover w-full h-24 rounded-xl"
                          />
                        ))}
                      </div>
                    )}

                    <AlertDialogFooter className="pt-4">
                      <AlertDialogCancel className="rounded-md">
                        Vazgeç
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmReplaceImages}
                        className="bg-black rounded-md dark:bg-white text-white dark:text-black"
                      >
                        Değiştir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Tümünü Sil */}
                <button
                  type="button"
                  onClick={clearAllImages}
                  className="py-1 px-3 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors text-sm"
                >
                  Tümünü Sil
                </button>
              </div>
            </div>
          )}

          {/* Görseller */}
          {imageData.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {imageData.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    width={300}
                    height={200}
                    className="object-cover w-full h-32 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* İlk yükleme */}
          {imageData.length === 0 && (
            <UploadDropzone
              className="mt-0 rounded-xl ut-button:bg-white ut-button:text-black ut-button:hover:bg-gray-100 ut-label:text-black ut-allowed-content:text-gray-600 ut-upload-icon:text-black ut-uploading:ut-button:hidden"
              endpoint={endpoint as any}
              onClientUploadComplete={handleInitialUpload}
              config={{ mode: "auto" }}
              appearance={{
                container:
                  "bg-white dark:bg-zinc-950 border border-gray-300 dark:border-[#313131] rounded-xl",
                button:
                  "bg-white text-black dark:bg-zinc-950 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1c1c1c] border border-gray-300 dark:border-[#313131] transition-colors",
                label: "text-black dark:text-white",
                allowedContent: "text-gray-600 dark:text-gray-400",
                uploadIcon: "text-black dark:text-white",
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
