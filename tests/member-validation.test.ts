import { describe, expect, it } from "vitest";
import {
  memberSchema,
  sanitizeSearchTerm,
  searchQuerySchema,
  validatePhoto,
  MAX_IMAGE_BYTES,
} from "@/lib/validation/member";

const validMember = {
  nama: "Budi Santoso",
  nis: "24100001",
  kelas_paralel: "XI-PPLG-1",
  kontak: "081234567890",
};

describe("memberSchema", () => {
  it("menerima data anggota lengkap yang valid", () => {
    const parsed = memberSchema.parse(validMember);
    expect(parsed.nama).toBe("Budi Santoso");
    expect(parsed.nis).toBe("24100001");
  });

  it("kontak boleh kosong (default \"\")", () => {
    const parsed = memberSchema.parse({ ...validMember, kontak: undefined });
    expect(parsed.kontak).toBe("");
  });

  it("memegang leading zero NIS (disimpan sebagai string)", () => {
    const parsed = memberSchema.parse({ ...validMember, nis: "00912345" });
    expect(parsed.nis).toBe("00912345");
  });

  it("menolak NIS non-digit atau terlalu pendek/panjang", () => {
    expect(memberSchema.safeParse({ ...validMember, nis: "24-100001" }).success).toBe(false);
    expect(memberSchema.safeParse({ ...validMember, nis: "123" }).success).toBe(false);
    expect(memberSchema.safeParse({ ...validMember, nis: "1".repeat(21) }).success).toBe(false);
  });

  it("menolak nama terlalu pendek atau kosong", () => {
    expect(memberSchema.safeParse({ ...validMember, nama: "A" }).success).toBe(false);
    expect(memberSchema.safeParse({ ...validMember, nama: "   " }).success).toBe(false);
  });

  it("menolak kelas_paralel kosong dan kontak kepanjangan", () => {
    expect(memberSchema.safeParse({ ...validMember, kelas_paralel: "" }).success).toBe(false);
    expect(memberSchema.safeParse({ ...validMember, kontak: "x".repeat(51) }).success).toBe(false);
  });

  it("menolak tipe data salah", () => {
    expect(memberSchema.safeParse({ ...validMember, nama: 123 }).success).toBe(false);
    expect(memberSchema.safeParse({}).success).toBe(false);
  });
});

describe("validatePhoto", () => {
  it("menerima JPG/PNG/WebP di bawah batas", () => {
    expect(validatePhoto({ type: "image/jpeg", size: 1024 })).toEqual({ ok: true });
    expect(validatePhoto({ type: "image/png", size: MAX_IMAGE_BYTES })).toEqual({ ok: true });
    expect(validatePhoto({ type: "image/webp", size: 1 })).toEqual({ ok: true });
  });

  it("menolak format di luar allowlist", () => {
    expect(validatePhoto({ type: "image/gif", size: 100 }).ok).toBe(false);
    expect(validatePhoto({ type: "application/pdf", size: 100 }).ok).toBe(false);
  });

  it("menolak file kosong dan file > 5MB", () => {
    expect(validatePhoto({ type: "image/jpeg", size: 0 }).ok).toBe(false);
    expect(validatePhoto({ type: "image/jpeg", size: MAX_IMAGE_BYTES + 1 }).ok).toBe(false);
  });
});

describe("searchQuerySchema", () => {
  it("default bila parameter kosong", () => {
    const parsed = searchQuerySchema.parse({});
    expect(parsed).toMatchObject({ q: "", page: 1, perPage: 12 });
  });

  it("mengkoersi string angka dari query string", () => {
    const parsed = searchQuerySchema.parse({ page: "3", perPage: "20" });
    expect(parsed.page).toBe(3);
    expect(parsed.perPage).toBe(20);
  });

  it("menolak page di bawah 1 dan perPage > 50", () => {
    expect(searchQuerySchema.safeParse({ page: "0" }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ perPage: "51" }).success).toBe(false);
  });
});

describe("sanitizeSearchTerm", () => {
  it("membuang karakter wildcard LIKE", () => {
    expect(sanitizeSearchTerm("100%_siswa")).toBe("100siswa");
    expect(sanitizeSearchTerm("budi")).toBe("budi");
  });
});