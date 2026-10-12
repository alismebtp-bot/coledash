import { useState } from "react";
import { Bug, X, Send, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function ReportBugButton() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("bug");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setOpen(false);
    setDescription("");
    toast.success("Merci ! Votre signalement a été envoyé.");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm hover:bg-slate-200 transition-colors"
        title="Signaler un problème"
      >
        <Bug className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-slate-500" />
                <h3 className="font-semibold text-slate-800">Signaler un problème</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Type de problème
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="bug">Bug / Erreur</option>
                  <option value="ui">Problème d'affichage</option>
                  <option value="performance">Lenteur</option>
                  <option value="feature">Suggestion</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le problème en détail..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2">
                  <Send className="h-4 w-4" />
                  {submitting ? "Envoi..." : "Envoyer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
