import Link from "next/link";

const navigation = [
{ name: "Dashboard", href: "/" },
{ name: "Repositories", href: "#" },
{ name: "Issues", href: "#" },
{ name: "Pull Requests", href: "#" },
{ name: "Actions", href: "#" },
{ name: "Chat", href: "#" },
];

export default function Home() {
return (
<div className="flex min-h-screen bg-zinc-50 text-zinc-900">
<aside className="hidden w-64 border-r border-zinc-200 bg-white md:block">
<div className="border-b border-zinc-200 px-6 py-5">
<h1 className="text-xl font-semibold">DCloud</h1>
<p className="mt-1 text-sm text-zinc-500">Developer Dashboard</p>
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

    <section className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {[
        ["Repositories", "0"],
        ["Open Issues", "0"],
        ["Open Pull Requests", "0"],
        ["Actions", "0"],
        ["Chat", "Ready"],
        ["Activity", "No activity yet"],
      ].map(([title, value]) => (
        <div
          key={title}
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </section>
  </main>
</div>

);
}