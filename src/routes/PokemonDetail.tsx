import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPokemonById } from "../services/pokemon";

function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Pokemon id missing");
      }
      return getPokemonById(id);
    },
    enabled: Boolean(id),
  });

  const abilities = data?.abilities ?? [];
  const moves = data?.moves ?? [];
  const forms = data?.forms ?? [];
  console.log(data);
  return (
    <section className="mx-auto max-w-3xl space-y-6 pb-10">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {isLoading ? (
        <div className="rounded-3xl bg-white/10 p-10 text-center text-slate-200">
          Loading Pokémon data...
        </div>
      ) : isError ? (
        <div className="rounded-3xl bg-rose-50 p-6 text-rose-600">
          {(error as Error).message || "Unable to load Pokémon details."}
        </div>
      ) : data ? (
        <div className="overflow-hidden rounded-4xl bg-linear-to-b from-rose-500 to-rose-600 shadow-[0_25px_45px_rgba(225,29,72,0.35)]">
          <div className="relative px-6 pb-32 pt-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold capitalize">{data.name}</h1>
              <p className="text-sm font-semibold">
                #{data.id.toString().padStart(3, "0")}
              </p>
            </div>

            <div className="absolute inset-0 -z-10 opacity-20">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_45%)]" />
            </div>

            <div className="mt-6 flex justify-center">
              <img
                src={data.image}
                alt={data.name}
                className="h-48 w-48 object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>

          <div className="rounded-t-4xl bg-white px-6 py-8 text-slate-700">
            {data.description ? (
              <p className="text-center text-sm text-slate-500">
                {data.description}
              </p>
            ) : null}

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <InfoCard title="Abilities" items={abilities} tone="rose" />
              <InfoCard title="Moves" items={moves} limit={12} tone="orange" />
              <InfoCard title="Forms" items={forms} tone="indigo" />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white/10 p-10 text-center text-slate-200">
          Pokémon not found.
        </div>
      )}
    </section>
  );
}

type InfoCardProps = {
  title: string;
  items: unknown[];
  limit?: number;
  tone?: "rose" | "orange" | "indigo";
};

function InfoCard({ title, items, limit, tone = "rose" }: InfoCardProps) {
  const list = typeof limit === "number" ? items.slice(0, limit) : items;
  const toneClasses: Record<typeof tone, string> = {
    rose: "from-rose-50 to-rose-100 text-rose-600",
    orange: "from-orange-50 to-orange-100 text-orange-600",
    indigo: "from-indigo-50 to-indigo-100 text-indigo-600",
  } as const;
  const badgeClasses: Record<typeof tone, string> = {
    rose: "bg-rose-100 text-rose-600",
    orange: "bg-orange-100 text-orange-600",
    indigo: "bg-indigo-100 text-indigo-600",
  } as const;

  return (
    <article className="flex flex-col rounded-2xl bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_12px_25px_rgba(15,23,42,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${toneClasses[tone]}`}>
          {title}
        </h2>
        <span className="text-xs text-slate-400">
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-slate-400">No data available.</p>
      ) : (
        <ul className="space-y-2 overflow-auto pr-2 text-sm text-slate-700">
          {list.map((item, idx) => (
            <li
              key={idx}
              className={`rounded-full px-4 py-2 capitalize ${badgeClasses[tone]}`}
            >
              {String(item)}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default PokemonDetail;
