import React, { useState } from "react";
import {
  Code2,
  Layers3,
  Rocket,
  Sparkles,
} from "lucide-react";

import "./Appgrade.css";

const projectTypes = [
  {
    id: "web",
    title: "Web App",
    description: "A responsive application for the web.",
    icon: Layers3,
  },
  {
    id: "mobile",
    title: "Mobile App",
    description: "An experience designed for phones.",
    icon: Rocket,
  },
  {
    id: "custom",
    title: "Something else",
    description: "Start with your own idea.",
    icon: Code2,
  },
];

export default function Appgrade() {
  const [selected, setSelected] = useState(null);
  const [idea, setIdea] = useState("");
  const [created, setCreated] = useState(false);

  const createProject = () => {
    if (!selected || !idea.trim()) {
      return;
    }

    setCreated(true);
  };

  return (
    <section className="appgrade-app">
      <header className="appgrade-app__header">
        <div className="appgrade-app__brand">
          <div className="appgrade-app__logo">
            <Sparkles size={20} />
          </div>

          <div>
            <strong>Appgrade</strong>
            <span>Build something better.</span>
          </div>
        </div>

        <span className="appgrade-app__status">
          AI BUILDER
        </span>
      </header>

      <main className="appgrade-app__content">
        {!created ? (
          <>
            <section className="appgrade-app__intro">
              <span>CREATE</span>

              <h1>
                What are you
                <br />
                building?
              </h1>

              <p>
                Start with an idea. Appgrade
                helps turn it into a project.
              </p>
            </section>

            <section className="appgrade-app__types">
              {projectTypes.map((type) => {
                const Icon = type.icon;

                return (
                  <button
                    key={type.id}
                    type="button"
                    className={
                      selected === type.id
                        ? "is-selected"
                        : ""
                    }
                    onClick={() =>
                      setSelected(type.id)
                    }
                  >
                    <Icon size={19} />

                    <span>
                      <strong>
                        {type.title}
                      </strong>

                      <small>
                        {type.description}
                      </small>
                    </span>

                    <i>›</i>
                  </button>
                );
              })}
            </section>

            <section className="appgrade-app__idea">
              <label htmlFor="appgrade-idea">
                Your idea
              </label>

              <textarea
                id="appgrade-idea"
                value={idea}
                onChange={(event) =>
                  setIdea(event.target.value)
                }
                placeholder="Describe what you want to create..."
                rows={4}
              />

              <button
                type="button"
                onClick={createProject}
                disabled={
                  !selected || !idea.trim()
                }
              >
                Start building
                <Rocket size={16} />
              </button>
            </section>
          </>
        ) : (
          <section className="appgrade-app__created">
            <div>
              <Sparkles size={25} />
            </div>

            <span>PROJECT CREATED</span>

            <h1>
              Let's build it.
            </h1>

            <p>
              Your {selected} project has been
              prepared from your idea.
            </p>

            <article>
              <strong>
                Project idea
              </strong>

              <span>
                {idea}
              </span>
            </article>

            <button
              type="button"
              onClick={() => {
                setCreated(false);
                setSelected(null);
                setIdea("");
              }}
            >
              Create another
            </button>
          </section>
        )}
      </main>
    </section>
  );
}