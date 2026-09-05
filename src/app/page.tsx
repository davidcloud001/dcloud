"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Repositories", href: "/repositories" },
  { name: "DC~BOT", href: "/chat" },
];

type DashboardData = {
  repositories: number;
};

export default function Home() {
  const [data, setData] = useState<DashboardData>({
    repositories: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const repositoriesResponse = await fetch(
          "/api/github/repositories",
        );

        if (!repositoriesResponse.ok) {
          throw new Error("Failed to load repositories");
        }

        const repositories = await repositoriesResponse.json();

        setData({
          repositories: Array.isArray(repositories)
            ? repositories.length
            : 0,
        });
      } catch (error) {
        console.error(
          "Failed to load GitHub dashboard data:",
          error,
        );
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Repositories",
      value: data.repositories,
      href: "/repositories",
    },
    {
      title: "DC~BOT",
      value: "Ready",
      href: "/chat",
    },
    {
      title: "Activity",
      value: "No activity yet",
      href: "#",
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <aside className="hidden w-64 border-r border-zinc-200 bg-white md:block">
        <div className="border-b border-zinc-200 px-6 py-5">
          <h1 className="text-xl font-semibold">DCloud</h1>

          <p className="mt-1 text-sm text-zinc-500">
            Developer Dashboard
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    item.name === "Dashboard"
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-6 py-5">
          <h2 className="text-2xl font-semibold">Dashboard</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Welcome to your DCloud developer dashboard.
          </p>
        </header>

        {error && (
          <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load GitHub dashboard data.
          </div>
        )}

        <section className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md"
            >
              <p className="text-sm font-medium text-zinc-500">
                {card.title}
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {loading && typeof card.value === "number"
                  ? "..."
                  : card.value}
              </p>

              {card.title === "Repositories" && (
                <p className="mt-3 text-xs text-zinc-500">
                  View your GitHub repositories
                </p>
              )}

              {card.title === "DC~BOT" && (
                <p className="mt-3 text-xs text-zinc-500">
                  Open the read-only AI coding and GitHub assistant
                </p>
              )}

              {card.title === "Activity" && (
                <p className="mt-3 text-xs text-zinc-500">
                  Recent developer activity will appear here
                </p>
              )}
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}