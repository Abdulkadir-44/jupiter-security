/**
 * Çıkış: oturumu veritabanından ve çerezden siler. Sadece POST (form + güvenlik anahtarı; kontrol src/middleware.ts).
 */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { destroySession } from "@/lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  await destroySession(env.DB, cookies);
  return redirect("/admin/giris", 303);
};

export const GET: APIRoute = ({ redirect }) => redirect("/admin", 303);
