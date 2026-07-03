/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file to make the portfolio yours.
 *  Every section of the site reads from here.
 * ─────────────────────────────────────────────────────────────
 */

/** Prefix for static assets — empty locally/Vercel, "/portfolio" on GitHub Pages. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE}${path}`;

export const site = {
  name: "Jatin Lilani",
  firstName: "Jatin",
  lastName: "Lilani",
  roles: ["AI Engineer", "Machine Learning", "Data Science", "Research"],
  tagline: "Building intelligent systems with an obsession for craft.",
  email: "jatinlilani2@gmail.com",
  location: "India",
  timezone: "Asia/Kolkata",
  links: {
    github: "https://github.com/jatinli",
    linkedin: "https://www.linkedin.com/in/jatinlilani",
    resume: `${BASE}/resume.pdf`,
  },
  metaDescription:
    "Jatin Lilani — AI/ML Engineer, Data Scientist and Researcher. Designing and shipping intelligent systems, from research prototypes to production-grade ML.",
};

export const manifesto = {
  statement:
    "I work at the intersection of research and product — where a model is only as good as the experience built around it.",
  paragraphs: [
    "Most engineers pick a lane: papers or products, notebooks or interfaces. I never could. The systems I love building are the ones where a well-posed research question ends up in a user's hands.",
    "That means training models and questioning their failure modes. Shipping pipelines and obsessing over the last 40 milliseconds. Reading papers on Sunday and design systems on Monday.",
  ],
  facts: [
    { label: "Focus", value: "Applied ML & Research" },
    { label: "Approach", value: "First principles" },
    { label: "Currently", value: "Open to opportunities" },
    { label: "Based in", value: "India" },
  ],
  principles: [
    {
      title: "Rigor before scale",
      body: "A model that isn't understood is a liability. I validate assumptions with ablations and error analysis before reaching for more compute.",
    },
    {
      title: "Systems over scripts",
      body: "Notebooks prove ideas; systems deliver them. I design ML the way good software is designed — testable, observable, reproducible.",
    },
    {
      title: "Taste is a feature",
      body: "The interface is part of the model. How intelligence is presented decides whether anyone trusts it enough to use it.",
    },
  ],
};

export type SkillNode = {
  id: string;
  label: string;
  /** 0–1 relative position in the constellation field */
  x: number;
  y: number;
  size: "lg" | "md" | "sm";
  items: string[];
  connections: string[];
};

export const skillNodes: SkillNode[] = [
  {
    id: "ml",
    label: "Machine Learning",
    x: 0.32,
    y: 0.28,
    size: "lg",
    items: ["PyTorch", "scikit-learn", "XGBoost", "Model evaluation", "Feature engineering"],
    connections: ["dl", "ds", "mlops"],
  },
  {
    id: "dl",
    label: "Deep Learning",
    x: 0.62,
    y: 0.16,
    size: "lg",
    items: ["Transformers", "CNNs", "Fine-tuning", "Attention mechanisms", "Embeddings"],
    connections: ["nlp", "cv", "research"],
  },
  {
    id: "nlp",
    label: "NLP & LLMs",
    x: 0.84,
    y: 0.34,
    size: "md",
    items: ["LLM fine-tuning", "RAG systems", "Prompt engineering", "Hugging Face", "LangChain"],
    connections: ["research", "eng"],
  },
  {
    id: "cv",
    label: "Computer Vision",
    x: 0.72,
    y: 0.58,
    size: "md",
    items: ["Object detection", "Segmentation", "OpenCV", "Image classification"],
    connections: ["dl", "mlops"],
  },
  {
    id: "ds",
    label: "Data Science",
    x: 0.14,
    y: 0.52,
    size: "lg",
    items: ["Statistical inference", "Pandas / NumPy", "Experiment design", "Visualization", "SQL"],
    connections: ["ml", "eng"],
  },
  {
    id: "mlops",
    label: "MLOps",
    x: 0.44,
    y: 0.66,
    size: "md",
    items: ["Docker", "CI/CD for ML", "Model serving", "Monitoring", "AWS / GCP"],
    connections: ["eng"],
  },
  {
    id: "eng",
    label: "Engineering",
    x: 0.28,
    y: 0.86,
    size: "md",
    items: ["Python", "TypeScript", "FastAPI", "Next.js", "PostgreSQL", "System design"],
    connections: ["ds", "mlops"],
  },
  {
    id: "research",
    label: "Research",
    x: 0.88,
    y: 0.78,
    size: "sm",
    items: ["Literature review", "Ablation studies", "Academic writing", "Reproducibility"],
    connections: ["nlp"],
  },
];

export type Experience = {
  period: string;
  role: string;
  org: string;
  summary: string;
  highlights: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    period: "2024 — Present",
    role: "AI/ML Engineer",
    org: "Independent / Research",
    summary:
      "Designing and shipping applied ML systems end-to-end — from problem framing and data strategy to deployed, monitored models.",
    highlights: [
      "Built retrieval-augmented generation systems over domain corpora",
      "Fine-tuned transformer models for classification and extraction tasks",
      "Owned the full lifecycle: data, training, evaluation, serving",
    ],
    tags: ["PyTorch", "LLMs", "RAG", "FastAPI"],
  },
  {
    period: "2023 — 2024",
    role: "Data Scientist",
    org: "Project Work",
    summary:
      "Turned messy real-world data into decisions — statistical modeling, forecasting, and analytics that stakeholders actually used.",
    highlights: [
      "Developed predictive models with rigorous cross-validation and error analysis",
      "Built automated data pipelines and reporting dashboards",
      "Communicated findings to non-technical audiences",
    ],
    tags: ["Python", "SQL", "scikit-learn", "Statistics"],
  },
  {
    period: "2022 — 2023",
    role: "ML Research & Foundations",
    org: "Academic / Self-directed",
    summary:
      "Deep dives into the fundamentals — implementing architectures from papers, reproducing results, and building intuition from first principles.",
    highlights: [
      "Implemented core architectures (transformers, CNNs) from scratch",
      "Reproduced published results and studied failure modes",
      "Built a foundation across math, statistics, and systems",
    ],
    tags: ["Deep Learning", "Papers", "Math", "Foundations"],
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  problem: string;
  solution: string;
  impact: string;
  tech: string[];
  /** hue used for the generative visual */
  hue: number;
  pattern: "nodes" | "grid" | "waves" | "orbits";
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "rag-engine",
    index: "01",
    title: "Domain-Aware RAG Engine",
    category: "AI / LLM Systems",
    year: "2025",
    problem:
      "Generic LLMs hallucinate on specialized domain questions, and naive retrieval pipelines surface irrelevant context that makes answers worse, not better.",
    solution:
      "A retrieval-augmented generation system with hybrid dense + sparse retrieval, semantic chunking tuned to document structure, and a reranking stage — wrapped in an evaluation harness that scores faithfulness on every change.",
    impact:
      "Grounded answers with traceable citations, measurably higher faithfulness than the naive baseline, and a pipeline that can be pointed at any new corpus in hours.",
    tech: ["Python", "LangChain", "FAISS", "Hugging Face", "FastAPI"],
    hue: 224,
    pattern: "nodes",
  },
  {
    id: "vision-inspect",
    index: "02",
    title: "Visual Inspection Pipeline",
    category: "Computer Vision",
    year: "2024",
    problem:
      "Manual visual quality inspection is slow, inconsistent between reviewers, and impossible to scale — while defects that slip through are expensive.",
    solution:
      "An end-to-end computer vision pipeline: augmentation-heavy training on limited labeled data, a fine-tuned detection model, and a review UI that keeps humans in the loop for low-confidence cases.",
    impact:
      "Consistent automated screening with human effort focused only where the model is uncertain — turning inspection from a bottleneck into a checkpoint.",
    tech: ["PyTorch", "OpenCV", "YOLO", "Docker"],
    hue: 262,
    pattern: "grid",
  },
  {
    id: "forecast-lab",
    index: "03",
    title: "Forecasting & Decision Lab",
    category: "Data Science",
    year: "2024",
    problem:
      "Business decisions were being made on gut feel because existing forecasts were black boxes nobody trusted — and nobody could tell when they were wrong.",
    solution:
      "A forecasting framework comparing statistical and ML approaches with honest backtesting, prediction intervals instead of point estimates, and diagnostics that show when and why the model is uncertain.",
    impact:
      "Forecasts with quantified uncertainty that stakeholders actually use — and a template for evaluating any future model against a rigorous baseline.",
    tech: ["Python", "statsmodels", "XGBoost", "Pandas", "Plotly"],
    hue: 200,
    pattern: "waves",
  },
  {
    id: "portfolio-os",
    index: "04",
    title: "This Portfolio",
    category: "Design Engineering",
    year: "2026",
    problem:
      "Most engineering portfolios look like rendered resumes. They prove you can code — not that you can think about products, experiences, or craft.",
    solution:
      "A designed-from-scratch interactive experience: custom cursor, canvas particle systems, scroll-choreographed storytelling and an original visual language — built on Next.js with performance budgets enforced.",
    impact:
      "The site itself is the case study — proof that engineering rigor and design sensitivity can come from the same person.",
    tech: ["Next.js", "TypeScript", "Framer Motion", "Canvas", "Tailwind"],
    hue: 240,
    pattern: "orbits",
  },
];

export type Publication = {
  index: string;
  title: string;
  venue: string;
  status: "Published" | "Under Review" | "Preprint" | "In Progress";
  year: string;
  abstract: string;
  metrics: { label: string; value: string }[];
  pdf?: string;
  code?: string;
  bibtex: string;
};

export const publications: Publication[] = [
  {
    index: "P·01",
    title:
      "Efficient Fine-Tuning Strategies for Domain Adaptation of Large Language Models",
    venue: "Working Paper",
    status: "In Progress",
    year: "2026",
    abstract:
      "Full fine-tuning of large language models is prohibitively expensive for most applied teams. This work systematically compares parameter-efficient fine-tuning methods — LoRA, prefix tuning, and adapter layers — across domain-adaptation tasks, measuring the trade-off surface between task performance, catastrophic forgetting, and compute budget. We propose a practical decision framework for selecting a strategy given data volume and hardware constraints.",
    metrics: [
      { label: "Methods compared", value: "3" },
      { label: "Tasks", value: "4" },
      { label: "Focus", value: "PEFT" },
    ],
    pdf: `${BASE}/resume.pdf`,
    code: "https://github.com/jatinli",
    bibtex: `@article{lilani2026peft,
  title={Efficient Fine-Tuning Strategies for Domain Adaptation of Large Language Models},
  author={Lilani, Jatin},
  year={2026},
  note={Working paper}
}`,
  },
  {
    index: "P·02",
    title:
      "On the Reliability of Retrieval-Augmented Generation Under Distribution Shift",
    venue: "Working Paper",
    status: "In Progress",
    year: "2026",
    abstract:
      "Retrieval-augmented generation systems are typically evaluated on in-distribution queries, yet deployed systems face queries that drift from the indexed corpus. We study how retrieval quality and answer faithfulness degrade under controlled distribution shift, and evaluate mitigation strategies including query rewriting, hybrid retrieval, and abstention mechanisms.",
    metrics: [
      { label: "Shift regimes", value: "5" },
      { label: "Mitigations", value: "3" },
      { label: "Focus", value: "RAG" },
    ],
    code: "https://github.com/jatinli",
    bibtex: `@article{lilani2026rag,
  title={On the Reliability of Retrieval-Augmented Generation Under Distribution Shift},
  author={Lilani, Jatin},
  year={2026},
  note={Working paper}
}`,
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Research", href: "#research" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

/**
 * ─────────────────────────────────────────────────────────────
 *  LATENT SPACE SYSTEM
 *  Each region of the site owns a hue. As you traverse the page,
 *  the global accent interpolates toward the active region's hue —
 *  color becomes wayfinding. `latentClusters` are the labeled
 *  points in the hero's navigable embedding projection.
 * ─────────────────────────────────────────────────────────────
 */

/** hue (0–360) per section id — drives the dynamic accent */
export const sectionHues: Record<string, number> = {
  top: 224, // identity — blue
  about: 268, // violet
  skills: 190, // cyan
  experience: 152, // green
  work: 32, // amber
  research: 306, // magenta
  resume: 210, // blue
  contact: 224,
};

export type LatentCluster = {
  id: string;
  label: string;
  href: string;
  /** normalized position in the projection field (0–1), desktop */
  x: number;
  y: number;
  /** normalized position on mobile, where the field sits in its own top panel */
  mx: number;
  my: number;
  hue: number;
  /** flavor caption — reads like a coordinate/annotation */
  meta: string;
};

export const latentClusters: LatentCluster[] = [
  { id: "about", label: "About", href: "#about", x: 0.6, y: 0.2, mx: 0.22, my: 0.22, hue: 268, meta: "identity" },
  { id: "skills", label: "Capabilities", href: "#skills", x: 0.86, y: 0.44, mx: 0.22, my: 0.7, hue: 190, meta: "n·8 nodes" },
  { id: "experience", label: "Experience", href: "#experience", x: 0.76, y: 0.32, mx: 0.68, my: 0.5, hue: 152, meta: "trajectory" },
  { id: "work", label: "Work", href: "#work", x: 0.9, y: 0.74, mx: 0.5, my: 0.82, hue: 32, meta: "4 studies" },
  { id: "research", label: "Research", href: "#research", x: 0.55, y: 0.4, mx: 0.52, my: 0.44, hue: 306, meta: "open problems" },
  { id: "contact", label: "Contact", href: "#contact", x: 0.82, y: 0.16, mx: 0.7, my: 0.18, hue: 224, meta: "reach out" },
];

/** the dimensionality flavor caption in the hero */
export const latentMeta = {
  dims: 47,
  caption: "2D projection · identity embedding",
};
