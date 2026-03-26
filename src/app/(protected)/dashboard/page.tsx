import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { DashboardSearch } from "@/components/dashboard-search";
import type { Thief } from "@/types";

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

const PAGE_SIZE = 20;

export default async function DashboardPage({ searchParams }: PageProps) {
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

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500">
          {total} entrée{total > 1 ? "s" : ""} dans la base
        </p>
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
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {thief.weward_pseudos.length > 0 ? (
                      thief.weward_pseudos.join(", ")
                    ) : (
                      <span className="text-gray-400">Pseudo inconnu</span>
                    )}
                  </p>
                  {(thief.facebook_first_name || thief.facebook_last_name) && (
                    <p className="text-sm text-gray-500 truncate">
                      {[thief.facebook_first_name, thief.facebook_last_name]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  )}
                  {thief.arnaque_type && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {thief.arnaque_type}
                    </p>
                  )}
                </div>
                <StatusBadge status={thief.status} />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(thief.created_at)}
              </p>
            </div>
          </Link>
        ))}
        {(!thieves || thieves.length === 0) && (
          <p className="text-center text-gray-500 py-8">
            Aucun résultat trouvé
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block mt-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pseudo(s) Weward
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nom Facebook
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type d&apos;arnaque
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {thieves?.map((thief: Thief) => (
                <tr
                  key={thief.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      <span className="font-medium text-gray-900">
                        {thief.weward_pseudos.length > 0
                          ? thief.weward_pseudos.join(", ")
                          : "—"}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      {[thief.facebook_first_name, thief.facebook_last_name]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      {thief.arnaque_type ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      <StatusBadge status={thief.status} />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <Link href={`/voleurs/${thief.id}`} className="block">
                      {formatDate(thief.created_at)}
                    </Link>
                  </td>
                </tr>
              ))}
              {(!thieves || thieves.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Aucun résultat trouvé
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
          <p className="text-gray-500">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/dashboard?q=${q}&status=${status}&page=${page - 1}`}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ← Précédent
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/dashboard?q=${q}&status=${status}&page=${page + 1}`}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Suivant →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
