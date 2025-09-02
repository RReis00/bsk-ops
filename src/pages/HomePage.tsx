import HomeCard from "../components/home/HomeCard";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-2xl">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Home</h2>
        <p className="opacity-80">Escolhe a área para navegar.</p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <HomeCard
          to="/today"
          icon={<span>📅</span>}
          title="Hoje"
          description="Tarefas do dia."
        />
        <HomeCard
          to="/week"
          icon={<span>🗓️</span>}
          title="Esta semana"
          description="Visão semanal."
        />
        <HomeCard
          to="/checklists"
          icon={<span>✅</span>}
          title="Checklists"
          description="Modelos e execuções."
        />
        <HomeCard
          to="/summaries"
          icon={<span>🧾</span>}
          title="Sumários"
          description="Notas e retrospetivas."
        />
        <HomeCard
          to="/blocks"
          icon={<span>⛔</span>}
          title="Bloqueios"
          description="Impedimentos e dependências."
        />
        <HomeCard
          to="/recurrences"
          icon={<span>🔁</span>}
          title="Recorrências de hoje"
          description="Tarefas recorrentes."
        />
      </div>
    </section>
  );
}
