import { useState } from "react";

export default function RoadmapForm({ onResult, loading, setLoading }) {
  const [goal, setGoal] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!goal.trim()) return;
    setLoading(true);
    try { await onResult(goal.trim()); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center justify-center mt-10">
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder='e.g. "Backend Developer"'
        className="w-full max-w-xl border rounded-lg px-4 py-3 outline-none shadow-sm"
      />
      <button type="submit" disabled={loading} className="px-5 py-3 rounded-lg bg-black text-white disabled:opacity-50">
        {loading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
}
