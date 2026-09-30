import { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  GitBranchPlus,
  MapPin,
  Sparkles
} from "lucide-react";
import "./Portfolio.css";
import { trackExternalClick } from "../../utils/analytics";

const projects = {
  auri: {
    name: "Auri",
    eyebrow: "SOCIAL PLATFORM & ECOSYSTEM",
    color: "#8c6ce0",
    summary: "A calmer social experience built across mobile, web, and backend services.",
    details: "Designed and developed a full-stack social product with React Native and Expo. Work includes authentication, social features, notifications, custom media caching, network-aware quality selection, and offline access to previously available content.",
    stack: ["React Native", "Expo", "React", "Redux", "Appwrite", "Media systems"]
  },
  natter: {
    name: "Natter",
    eyebrow: "COMMUNICATION PRODUCT",
    color: "#438fc5",
    summary: "A product in the Innoxation portfolio focused on expressive, connected communication.",
    details: "Natter is part of Jacob's independent product work. This portfolio entry is a guided overview; the surrounding desktop demonstrates how the projects are organized and presented.",
    stack: ["Product engineering", "Web", "Application design"]
  },
  groa: {
    name: "G.R.O.A.",
    eyebrow: "GLOBAL RISK OBSERVATION & ANALYSIS",
    color: "#e18b56",
    summary: "A global information platform for monitoring risks and unfolding events.",
    details: "Aggregates and normalizes crisis, earthquake, weather, and other risk information from external providers. Engineering work includes resilient API integrations, timeouts, data transformation, deduplication, synchronization, and application-level alert heuristics.",
    stack: ["React", "Node.js", "Appwrite", "Redux", "WebAssembly", "External APIs"]
  },
  normal: {
    name: "N.O.R.M.A.L.",
    eyebrow: "AI ENGINE & PLATFORM",
    color: "#5278d0",
    summary: "A modular AI platform under active development at Innoxation.",
    details: "Designed around generation workflows, model and job tracking, persistence, background tasks, rate limits, and safety controls. This portfolio assistant uses local intent logic today; Telvin's production engine is a separate project and is not required for these commands.",
    stack: ["Python", "FastAPI", "PyTorch", "Supabase", "Redis", "Celery"]
  },
  appgrade: {
    name: "Appgrade",
    eyebrow: "SOFTWARE PRODUCT",
    color: "#47a889",
    summary: "An Innoxation product exploring software experiences and product development.",
    details: "Part of Jacob's wider independent engineering portfolio. This overview is presented inside the portfolio OS as a guided project card.",
    stack: ["Product engineering", "Web applications"]
  },
};

export default function Portfolio({ view = "about", project = "auri" }) {
  const [active, setActive] = useState(view);
  const selectedProject = projects[project] || projects.auri;

  if (active === "project")
    return (
      <section
        className="portfolio-profile portfolio-project-view">
        <header
          className="portfolio-hero"
          style={{
            "--portfolio-accent": selectedProject.color
          }}>
          <span className="portfolio-kicker">
            {selectedProject.eyebrow}
          </span>
          <h1>{selectedProject.name}</h1>
          <p>{selectedProject.summary}</p>
        </header>
        <div className="portfolio-detail-grid">
          <article>
            <h2>Overview</h2>
            <p>{selectedProject.details}</p>
          </article>
          <article>
            <h2>Technology</h2>
            <div className="portfolio-tags">
              {selectedProject.stack.map(item =>
                <span key={item}>{item}</span>
              )}
            </div>
          </article>
        </div>
        <footer className="portfolio-note">
          <Sparkles size={15} />
          Ask Telvin about this project or say Show me another project.
        </footer>
      </section>
    );

  const tabs = [["about", "Profile"], ["experience", "Experience"], ["skills", "Technical skills"]];

  return (
    <section className="portfolio-profile">
      <aside className="portfolio-sidebar">
        <div className="portfolio-monogram">JM</div>
        <strong>Jacob B Mongolo</strong>
        <span>Full Stack & AI Engineer</span>
        <div className="portfolio-location">
          <MapPin size={13} />
          Open to relocation - Germany
        </div>
        <nav>
          {tabs.map(([id, label]) =>
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() =>
                setActive(id)}>
              {label}
            </button>
          )}
        </nav>
<a
          href="https://github.com/J-4-K-3"
          target="_blank"
          rel="noreferrer"
          onClick={() => trackExternalClick("github", "https://github.com/J-4-K-3")}>
          <GitBranchPlus size={14} />
          GitHub
          <ArrowUpRight size={13} />
        </a>
      </aside>
      <main className="portfolio-main">
        {active === "about" && <>
          <span className="portfolio-kicker">INDEPENDENT ENGINEER - INNOXATION</span>
          <h1>Building useful things from first principles.</h1>
          <p className="portfolio-lead">
            Self-taught Full Stack & AI Engineer with 8+ years of programming experience.
            I take software from an initial idea through architecture, implementation,
            debugging, deployment, and iteration.
          </p>
          <div className="portfolio-stat-row">
            <div>
              <strong>8+</strong>
              <small>years programming</small>
            </div>
            <div>
              <strong>4</strong>
              <small>selected products</small>
            </div>
            <div>
              <strong>DE</strong>
              <small>open to relocation</small>
            </div>
          </div>
          <article className="portfolio-callout">
            <Sparkles size={18} />
            <p>Creator of Innoxation, an independent technology initiative spanning social products,
              AI, mobile, web applications, and infrastructure.
            </p>
          </article>
        </>
        }
        {active === "experience" && <>
          <span className="portfolio-kicker">EXPERIENCE</span>
          <h1>Independent engineering practice.</h1>
          <article className="portfolio-timeline">
            <BriefcaseBusiness />
            <div>
              <h2>Independent Software Engineer / Founder</h2>
              <span>Innoxation - 2024 - Present</span>
              <p>
                Architects and builds products across frontend, mobile, backend, databases, APIs,
                AI systems, and infrastructure. Owns work from product concept through implementation
                and deployment.
              </p>
            </div>
          </article>
          <article className="portfolio-timeline">
            <Code2 />
            <div>
              <h2>Freelance Software Development</h2>
              <span>Upwork</span>
              <p>Independent development work, technical communication, and self-directed
                research across changing requirements and technology stacks.
              </p>
            </div>
          </article>
          <article className="portfolio-education">
            <strong>Education</strong>
            <span>
              Formal education through Grade 9; continued technical education through project work, documentation,
              experimentation, and self-directed learning.
            </span>
          </article>
        </>
        }
        {active === "skills" && <>
          <span className="portfolio-kicker">ENGINEERING TOOLKIT</span>
          <h1>Broad product engineering, built hands-on.</h1>
          <div className="portfolio-skill-grid">
            {[
              ["Full Stack", "React", "JavaScript", "TypeScript", "Node.js", "Python"],
              ["Mobile", "React Native", "Expo", "Flutter", "Android / iOS"],
              ["Backend", "FastAPI", "REST APIs", "Appwrite", "Supabase", "Firebase"],
              ["AI / ML", "PyTorch", "TensorFlow", "Transformers", "embeddings"],
              ["Data & infrastructure", "SQL", "MongoDB", "Redis", "Docker", "WebAssembly"],
              ["Engineering", "Architecture", "debugging", "performance", "API", "integration"]].map(([title, text]) =>
                <article key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </article>
              )}
          </div>
        </>
        }
      </main>
    </section>
  );
}
