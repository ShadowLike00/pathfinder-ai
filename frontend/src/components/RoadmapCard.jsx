export default function RoadmapCard({ step, index }) {
  return (
    <div className="rounded-xl border p-5 shadow-sm bg-white">
      <div className="text-sm opacity-60 mb-1">Step {index + 1}</div>
      <h3 className="text-lg font-semibold">{step.title}</h3>
      {step.why && <p className="mt-1 text-sm">{step.why}</p>}

      {step.topics?.length > 0 && (
        <div className="mt-3">
          <div className="font-medium text-sm">Topics</div>
          <ul className="list-disc ml-5 text-sm">
            {step.topics.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      {step.resources?.length > 0 && (
        <div className="mt-3">
          <div className="font-medium text-sm">Resources</div>
          <ul className="list-disc ml-5 text-sm">
            {step.resources.map((r, i) => (
              <li key={i}><a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
            ))}
          </ul>
        </div>
      )}

      {step.project && (
        <div className="mt-3">
          <div className="font-medium text-sm">Mini‑project</div>
          <p className="text-sm">{step.project}</p>
        </div>
      )}
    </div>
  );
}
