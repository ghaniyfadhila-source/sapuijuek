"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize } from "lucide-react";

type Activity = {
  id: string;
  nama_acara: string;
  deskripsi: string;
  tanggal: string;
  photos: string[];
  created_at: string;
};

type Props = {
  initialActivities: Activity[];
  tagline: string;
};

export default function KegiatanClient({ initialActivities, tagline }: Props) {
  const [activities] = useState<Activity[]>(initialActivities);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentActivityIdx, setCurrentActivityIdx] = useState(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function openLightbox(activityIdx: number, photoIdx = 0) {
    setCurrentActivityIdx(activityIdx);
    setCurrentPhotoIdx(photoIdx);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function nextPhoto() {
    const act = activities[currentActivityIdx];
    if (act.photos.length > currentPhotoIdx + 1) {
      setCurrentPhotoIdx(currentPhotoIdx + 1);
    }
  }

  function prevPhoto() {
    if (currentPhotoIdx > 0) {
      setCurrentPhotoIdx(currentPhotoIdx - 1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!lightboxOpen) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  }

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10" onKeyDown={handleKeyDown}>
        <section className="glass rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold">Galeri Kegiatan Kelas</h1>
          <p className="mt-2 text-slate-600">{tagline}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div>
              <span className="block text-3xl font-bold text-brand">{activities.length}</span>
              <span className="text-slate-600">Album Kegiatan</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-brand">
                {activities.reduce((sum, a) => sum + (a.photos?.length || 0), 0)}
              </span>
              <span className="text-slate-600">Total Foto</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Album Kegiatan</h2>
          {activities.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-slate-600">
              Belum ada kegiatan yang terdokumentasi.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a, actIdx) => (
                <article
                  key={a.id}
                  className="glass group flex flex-col rounded-2xl overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 cursor-pointer"
                  onClick={() => a.photos?.length && openLightbox(actIdx, 0)}
                >
                  {a.photos?.length ? (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={a.photos[0]}
                        alt={a.nama_acara}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-sm text-white">
                          {a.photos.length} foto
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); openLightbox(actIdx, 0); }}
                          className="rounded-full bg-white/90 p-2 text-brand hover:bg-white transition-colors"
                          aria-label="Buka lightbox"
                        >
                          <Maximize className="size-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-slate-100 text-slate-400">
                      Tidak ada foto
                    </div>
                  )}
                  <div className="flex-1 flex flex-col p-5">
                    <h3 className="font-semibold text-lg line-clamp-1">{a.nama_acara}</h3>
                    <p className="mt-2 text-sm text-slate-600">{formatDate(a.tanggal)}</p>
                    {a.deskripsi && <p className="mt-3 flex-1 text-sm text-slate-700 line-clamp-2">{a.deskripsi}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && activities[currentActivityIdx] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${currentPhotoIdx + 1} dari ${activities[currentActivityIdx].photos.length}`}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Tutup"
          >
            <X className="size-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors hidden sm:flex"
            aria-label="Foto sebelumnya"
            disabled={currentPhotoIdx === 0}
          >
            <ChevronLeft className="size-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full px-4">
            <Image
              src={activities[currentActivityIdx].photos[currentPhotoIdx]}
              alt={`${activities[currentActivityIdx].nama_acara} - Foto ${currentPhotoIdx + 1}`}
              fill
              className="object-contain"
              priority
              sizes="90vw"
            />
            <div className="mt-4 flex items-center justify-between text-white">
              <div>
                <p className="font-semibold">{activities[currentActivityIdx].nama_acara}</p>
                <p className="text-sm opacity-70">{formatDate(activities[currentActivityIdx].tanggal)}</p>
              </div>
              <div className="text-sm opacity-70">
                {currentPhotoIdx + 1} / {activities[currentActivityIdx].photos.length}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors hidden sm:flex"
            aria-label="Foto selanjutnya"
            disabled={currentPhotoIdx === activities[currentActivityIdx].photos.length - 1}
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Mobile swipe hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/70 text-sm sm:hidden">
            <span>Geser untuk navigasi</span>
          </div>
        </div>
      )}
    </>
  );
}