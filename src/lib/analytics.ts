/**
 * Genel bakış'taki ziyaretçi kartı: Cloudflare Web Analytics (GraphQL API), sunucuda okunur.
 *
 * Gerekenler (Worker gizli değişkenleri; kodda ya da repoda DURMAZ):
 *   CF_API_TOKEN   → Cloudflare'de "Account Analytics: Read" yetkili, sadece okuma yapan bir API token
 *   CF_ACCOUNT_ID  → Cloudflare hesap kimliği
 * Ekleme: npx wrangler secret put CF_API_TOKEN  (canlı)  |  yerelde .dev.vars dosyası (gitignore'da)
 * Yoksa kart "kurulum bekliyor" gösterir; panel çalışmaya devam eder.
 *
 * Hesapta başka bir site de olduğu için sorgu her zaman bu sitenin adresiyle (requestHost) süzülür.
 * Sonuç her Worker kopyasında 10 dakika saklanır (her panel açılışında API'ye gidilmesin).
 */
export interface VisitStats {
  thisWeek: { visits: number; views: number };
  lastWeek: { visits: number; views: number };
}
export type VisitResult = { ok: true; stats: VisitStats } | { ok: false; reason: "not-configured" | "error" };

let cache: { key: string; at: number; result: VisitResult } | null = null;
const TTL = 10 * 60_000;

const day = (d: Date) => d.toISOString().slice(0, 10);

export async function weeklyVisits(env: { CF_API_TOKEN?: string; CF_ACCOUNT_ID?: string }, host: string): Promise<VisitResult> {
  if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) return { ok: false, reason: "not-configured" };
  if (cache && cache.key === host && Date.now() - cache.at < TTL) return cache.result;

  const now = new Date();
  const from = new Date(now.getTime() - 13 * 86_400_000); // son 14 gün: bu hafta + geçen hafta
  const split = day(new Date(now.getTime() - 6 * 86_400_000)); // bu haftanın ilk günü (bugün dahil 7 gün)
  const query = `query ($acc: String!, $host: String!, $from: Date!, $to: Date!) {
    viewer { accounts(filter: { accountTag: $acc }) {
      rumPageloadEventsAdaptiveGroups(limit: 30, filter: { date_geq: $from, date_leq: $to, requestHost: $host }) {
        count sum { visits } dimensions { date }
      }
    } }
  }`;
  try {
    const r = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: { authorization: `Bearer ${env.CF_API_TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({ query, variables: { acc: env.CF_ACCOUNT_ID, host, from: day(from), to: day(now) } }),
    });
    const json = (await r.json()) as {
      data?: { viewer?: { accounts?: { rumPageloadEventsAdaptiveGroups?: { count: number; sum: { visits: number }; dimensions: { date: string } }[] }[] } };
      errors?: unknown[];
    };
    const rows = json.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups;
    if (!r.ok || json.errors?.length || !rows) throw new Error(JSON.stringify(json.errors ?? r.status));
    const stats: VisitStats = { thisWeek: { visits: 0, views: 0 }, lastWeek: { visits: 0, views: 0 } };
    for (const g of rows) {
      const bucket = g.dimensions.date >= split ? stats.thisWeek : stats.lastWeek;
      bucket.visits += g.sum.visits;
      bucket.views += g.count;
    }
    const result: VisitResult = { ok: true, stats };
    cache = { key: host, at: Date.now(), result };
    return result;
  } catch (err) {
    console.error("[analytics] okunamadı:", err);
    return { ok: false, reason: "error" };
  }
}
