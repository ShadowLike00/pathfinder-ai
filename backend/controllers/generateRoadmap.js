import { Roadmap } from "../models/roadmapModel.js";

const GRAPH = {
  "backend developer": [
    {
      title: "Pick a Language",
      why: "Core programming foundation.",
      topics: ["Syntax", "Data Structures", "OOP"],
      suggestions: ["JavaScript (Node.js)", "Python", "Go"],
      resources: [
        { label: "freeCodeCamp JS", url: "https://www.freecodecamp.org/learn" },
        { label: "Python Docs", url: "https://docs.python.org/3/tutorial/" }
      ],
      project: "CLI calculator (parse expressions + tests)."
    },
    {
      title: "HTTP & APIs",
      why: "Everything talks over HTTP/REST or GraphQL.",
      topics: ["HTTP methods", "Status codes", "Routing", "JSON"],
      resources: [
        { label: "MDN: HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP" }
      ],
      project: "Build a REST API for a notes app."
    },
    {
      title: "Databases",
      why: "Persist and query data.",
      topics: ["SQL vs NoSQL", "Indexes", "ORM/ODM", "Transactions"],
      resources: [
        { label: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/" },
        { label: "MongoDB Basics", url: "https://www.mongodb.com/docs/" }
      ],
      project: "Blog DB with users, posts, comments."
    },
    {
      title: "Framework & Auth",
      why: "Real apps need structure and security.",
      topics: ["Express.js", "Auth (JWT, sessions)", "Validation"],
      resources: [
        { label: "Express Guide", url: "https://expressjs.com/" }
      ],
      project: "User login + JWT‑protected CRUD API."
    },
    {
      title: "Deploy & DevOps",
      why: "Ship it and keep it running.",
      topics: ["CI/CD", "Docker", "Cloud Hosting", "Monitoring"],
      resources: [
        { label: "Docker Docs", url: "https://docs.docker.com/get-started/" }
      ],
      project: "Containerize and deploy API."
    }
  ],
  "data scientist": [
    {
      title: "Programming & Math",
      why: "Foundation for analysis and models.",
      topics: ["Python", "Pandas", "Linear Algebra", "Stats"],
      resources: [
        { label: "Pandas Docs", url: "https://pandas.pydata.org/docs/" }
      ],
      project: "EDA on a Kaggle dataset."
    }
  ]
};

async function maybeExpandWithLLM(goal, steps) {
  const useLLM = process.env.OPENAI_API_KEY && process.env.USE_LLM === "true";
  if (!useLLM) return steps;
  try {
    const { OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
Return ONLY a JSON array of roadmap steps with keys:
title, why, topics, resources[{label,url}], project.
Goal: ${goal}
Base: ${JSON.stringify(steps)}
`;
    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.5,
    });
    const text = resp.output_text?.trim() || "";
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start !== -1 && end !== -1) return JSON.parse(text.slice(start, end + 1));
    return steps;
  } catch (e) {
    console.warn("LLM expansion failed:", e.message);
    return steps;
  }
}

export async function generateRoadmap(req, res) {
  try {
    const goalRaw = String(req.body.goal || "").trim();
    if (!goalRaw) return res.status(400).json({ error: "goal is required" });

    const goal = goalRaw.toLowerCase();
    const base = GRAPH[goal] || GRAPH["backend developer"];

    const steps = await maybeExpandWithLLM(goalRaw, base);

    let saved = null;
    try {
      saved = await Roadmap.create({ goal: goalRaw, steps });
    } catch (_) {}

    res.json({ goal: goalRaw, steps, id: saved?._id || null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error" });
  }
}
