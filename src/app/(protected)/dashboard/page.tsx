import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { DashboardSearch } from "@/components/dashboard-search";
import type { Thief } from "@/types";
import { getT } from "@/lib/i18n/server";

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

const PAGE_SIZE = 20;

export default async function DashboardPage({ searchParams }: PageProps) {
  const { locale, t } = await getT();
  const params = await searchParams;
  const q = params.q ?? "";
  const status = params.status ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  let query = supabase
    .from("thieves")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (status === "confirmed" || status === "suspected") {
    query = query.eq("status", status);
  }

  if (q) {
    const searchTerm = q.toLowerCase();
    query = query.or(
      `facebook_first_name.ilike.%${searchTerm}%,facebook_last_name.ilike.%${searchTerm}%,weward_pseudos.cs.{${searchTerm}}`,
    );
  }

  const { data: thieves, count } = await query;
  const total = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const entriesSubtitle =
    locale === "en"
      ? `${total} ${total === 1 ? t("dashboard.entry") : t("dashboard.entries")} ${t("dashboard.entriesInDb")}`
      : `${total} ${total > 1 ? t("dashboard.entries") : t("dashboard.entry")} ${t("dashboard.entriesInDb")}`;

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("dashboard.title")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{entriesSubtitle}</p>
      </div>

      <DashboardSearch defaultQ={q} defaultStatus={status} />

      {/* Mobile cards */}
      <div className="mt-4 space-y-4 lg:hidden">
        {thieves?.map((thief: Thief) => (
          <Link
            key={thief.id}
            href={`/voleurs/${thief.id}`}
            className="block"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {thief.weward_pseudos.length > 0 ? (
                      thief.weward_pseudos.join(", ")
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">{t("dashboard.unknownPseudo")}</span>
                    )}
                  </p>
                  {(thief.facebook_first_name || thief.facebook_last_name) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {[thief.facebook_first_name, thief.facebook_last_name]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  )}
                  {thief.arnaque_type && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                      {thief.arnaque_type}
                    </p>
                  )}
                </div>
                <StatusBadge status={thief.status} />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {formatDate(thief.created_at, locale)}
              </p>
            </div>
          </Link>
        ))}
        {(!thieves || thieves.length === 0) && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t("dashboard.noResults")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("dashboard.colPseudos")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("dashboard.colFacebook")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("dashboard.colType")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("dashboard.colStatus")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("dashboard.colDate")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {thieves?.map((thief: Thief) => (
                <tr
                  key={thief.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {thief.weward_pseudos.length > 0
                          ? thief.weward_pseudos.join(", ")
                          : "—"}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      {[thief.facebook_first_name, thief.facebook_last_name]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      {thief.arnaque_type ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      <StatusBadge status={thief.status} />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      {formatDate(thief.created_at, locale)}
                    </Link>
                  </td>
                </tr>
              ))}
              {(!thieves || thieves.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t("dashboard.noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            {t("dashboard.page")} {page} {t("dashboard.of")} {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/dashboard?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page - 1}`}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("dashboard.prev")}
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/dashboard?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page + 1}`}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("dashboard.next")}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
