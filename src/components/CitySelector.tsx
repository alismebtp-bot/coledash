import { useState } from "react";
import { useCity } from "../context/CityContext";
import { MapPin, ChevronDown, Navigation } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const cities = [
  { id: "paris", name: "Paris", region: "Île-de-France" },
  { id: "lyon", name: "Lyon", region: "Auvergne-Rhône-Alpes" },
  { id: "marseille", name: "Marseille", region: "Provence-Alpes-Côte d'Azur" },
  { id: "bordeaux", name: "Bordeaux", region: "Nouvelle-Aquitaine" },
  { id: "lille", name: "Lille", region: "Hauts-de-France" },
  { id: "toulouse", name: "Toulouse", region: "Occitanie" },
  { id: "nantes", name: "Nantes", region: "Pays de la Loire" },
  { id: "strasbourg", name: "Strasbourg", region: "Grand Est" },
  { id: "nice", name: "Nice", region: "Provence-Alpes-Côte d'Azur" },
  { id: "rennes", name: "Rennes", region: "Bretagne" },
];

interface CitySelectorProps {
  variant?: "header" | "hero";
}

export default function CitySelector({ variant = "header" }: CitySelectorProps) {
  const { city, setCity } = useCity();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase())
  );

  if (variant === "hero") {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Livraison à</p>
              <p className="font-semibold text-slate-800">{city?.name || "Choisir une ville"}</p>
            </div>
          </div>
          <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border bg-white shadow-xl">
              <div className="p-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une ville..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto p-1">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCity(c);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      city?.id === c.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <Navigation className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.region}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
      >
        <MapPin className="h-4 w-4" />
        <span>{city?.name || "Ville"}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border bg-white shadow-xl">
            <div className="p-3">
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                autoFocus
              />
            </div>
            <div className="max-h-56 overflow-y-auto p-1">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCity(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    city?.id === c.id
                      ? "bg-emerald-50 text-emerald-700"
                      : "hover:bg-slate-50"
                  )}
                >
                  <Navigation className="h-3.5 w-3.5 text-slate-400" />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
