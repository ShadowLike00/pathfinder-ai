import { useState } from "react";
import RoadmapForm from "../components/RoadmapForm.jsx";
import RoadmapCard from "../components/RoadmapCard.jsx";
import { generateRoadmap } from "../services/api.js";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onResult = async (goal) => {
    const data = await generateRoadmap(goal);
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-8 text-center">
        <h1 className="text-3xl font-bold">Pathfinder AI</h1>
        <p className="opacity-70 mt-1">Tell us your goal. Get a clear roadmap.</p>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <RoadmapForm onResult={onResult} loading={loading} setLoading={setLoading} />
        {result && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Roadmap for “{result.goal}”</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {result.steps.map((s, i) => <RoadmapCard key={i} step={s} index={i} />)}
            </div>
          </section>
        )}
      </main>

      <footer className="py-10 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Pathfinder AI
      </footer>
    </div>
  );
}
