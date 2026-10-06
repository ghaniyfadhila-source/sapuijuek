import { describe, expect, it } from "vitest";
import {
  decodeJwtPayload,
  isProtectedAdminPath,
  isValidSessionToken,
} from "@/lib/auth/session";
import { buildAuthCookies } from "@/lib/auth/cookies";
import { loginSchema } from "@/lib/auth/login-schema";

function fakeJwt(payload: object): string {
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64(payload)}.signature`;
}

describe("decodeJwtPayload", () => {
  it("mendecode payload JWT yang valid", () => {
    const payload = decodeJwtPayload(fakeJwt({ exp: 123, role: "authenticated" }));
    expect(payload).toMatchObject({ exp: 123, role: "authenticated" });
  });

  it("mengembalikan null untuk string bukan JWT", () => {
    expect(decodeJwtPayload("bukan-jwt")).toBeNull();
    expect(decodeJwtPayload("a.b")).toBeNull();
  });
});

describe("isValidSessionToken", () => {
  const future = () => Math.floor(Date.now() / 1000) + 3600;
  const past = () => Math.floor(Date.now() / 1000) - 10;

  it("token dengan exp masa depan dianggap valid", () => {
    expect(isValidSessionToken(fakeJwt({ exp: future() }))).toBe(true);
  });

  it("token yang sudah kedaluwarsa tidak valid", () => {
    expect(isValidSessionToken(fakeJwt({ exp: past() }))).toBe(false);
  });

  it("hormati parameter now (expiry deterministik)", () => {
    const token = fakeJwt({ exp: 1_000_000 }); // exp = 1970-01-12
    expect(isValidSessionToken(token, 999_999 * 1000)).toBe(true);
    expect(isValidSessionToken(token, 1_000_001 * 1000)).toBe(false);
  });

  it("token tanpa klaim exp tidak valid", () => {
    expect(isValidSessionToken(fakeJwt({ role: "authenticated" }))).toBe(false);
  });

  it("string kosong/sampah/null/undefined tidak valid", () => {
    expect(isValidSessionToken("")).toBe(false);
    expect(isValidSessionToken("bukan.jwt.sama.sekali")).toBe(false);
    expect(isValidSessionToken(undefined)).toBe(false);
    expect(isValidSessionToken(null)).toBe(false);
  });
});

describe("isProtectedAdminPath (guard /admin)", () => {
  it("melindungi /admin dan semua turunannya", () => {
    expect(isProtectedAdminPath("/admin")).toBe(true);
    expect(isProtectedAdminPath("/admin/")).toBe(true);
    expect(isProtectedAdminPath("/admin/user-management")).toBe(true);
  });

  it("membolehkan subtree /admin/login tanpa login", () => {
    expect(isProtectedAdminPath("/admin/login")).toBe(false);
    expect(isProtectedAdminPath("/admin/login/")).toBe(false);
  });

  it("path lain di luar /admin tidak terpengaruh", () => {
    expect(isProtectedAdminPath("/profil")).toBe(false);
    expect(isProtectedAdminPath("/administrator")).toBe(false);
    expect(isProtectedAdminPath("/")).toBe(false);
  });
});

describe("loginSchema", () => {
  it("menerima kredensial valid dan menormalkan email", () => {
    const parsed = loginSchema.parse({
      email: "  Admin@PPLG.SMKN9.SCH.ID ",
      password: "rahasia123",
    });
    expect(parsed.email).toBe("admin@pplg.smkn9.sch.id");
    expect(parsed.password).toBe("rahasia123");
  });

  it("menolak format email salah", () => {
    const parsed = loginSchema.safeParse({ email: "bukan-email", password: "rahasia123" });
    expect(parsed.success).toBe(false);
  });

  it("menolak password pendek", () => {
    const parsed = loginSchema.safeParse({ email: "a@b.com", password: "pendek" });
    expect(parsed.success).toBe(false);
  });

  it("menolak tipe data salah", () => {
    expect(loginSchema.safeParse({ email: 123, password: true }).success).toBe(false);
    expect(loginSchema.safeParse({}).success).toBe(false);
  });
});

describe("buildAuthCookies", () => {
  it("membuat cookie httpOnly dengan maxAge yang diberikan", () => {
    const cookies = buildAuthCookies("access", "refresh", 3600);
    expect(cookies).toHaveLength(2);
    const [access, refresh] = cookies;
    expect(access.name).toBe("sb-access-token");
    expect(access.value).toBe("access");
    expect(refresh.name).toBe("sb-refresh-token");
    expect(refresh.value).toBe("refresh");
    for (const c of cookies) {
      expect(c.options.httpOnly).toBe(true);
      expect(c.options.sameSite).toBe("lax");
      expect(c.options.path).toBe("/");
      expect(c.options.maxAge).toBe(3600);
    }
  });
});
