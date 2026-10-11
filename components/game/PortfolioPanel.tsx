import { experience, projects, skillGroups, socialLinks } from "@/lib/data";
import { destinations, type Overlay, type Section } from "@/lib/game/world";

export function PortfolioPanel({
  section,
  projectId,
  onProject,
  onOpen,
  onTravel,
}: {
  section: Overlay;
  projectId?: string;
  onProject: (id: string) => void;
  onOpen: (section: Section) => void;
  onTravel: (section: Section) => void;
}) {
  const project = projects.find((p) => p.id === projectId) ?? projects[0];
  if (section === "projects")
    return (
      <div className="project-view">
        <nav className="project-selector" aria-label="Choose a project">
          {projects.map((p, i) => (
            <button
              key={p.id}
              className={p.id === project.id ? "selected" : ""}
              onClick={() => onProject(p.id)}
            >
              <span>0{i + 1}</span>
              {p.title}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>
        <article key={project.id} className="project-detail">
          <p className="panel-eyebrow">FIELD NOTES / {project.category}</p>
          <h3>{project.title}</h3>
          <p className="project-lead">{project.summary}</p>
          <div
            className={`project-illustration illustration-${project.id}`}
            aria-hidden="true"
          >
            <span className="visual-grid" />
            {project.id === "focusflow" ? (
              <>
                <div className="focus-reticle">
                  <i />
                  <i />
                  <i />
                  <i />
                  <span>◎</span>
                </div>
                <span className="visual-caption">ATTENTION / IN FOCUS</span>
              </>
            ) : project.id === "shortform-editor" ? (
              <>
                <div className="edit-timeline">
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} style={{ height: `${28 + ((i * 19) % 46)}%` }} />
                  ))}
                </div>
                <span className="visual-caption">
                  FOOTAGE → INTELLIGENCE → STORY
                </span>
              </>
            ) : project.id === "soulsync" ? (
              <>
                <div className="voice-wave">
                  {Array.from({ length: 29 }, (_, i) => (
                    <i
                      key={i}
                      style={{ height: `${12 + Math.sin(i * 1.4) ** 2 * 68}%` }}
                    />
                  ))}
                </div>
                <span className="visual-caption">
                  A MORE HUMAN CONVERSATION
                </span>
              </>
            ) : (
              <>
                <div className="research-orbit">
                  <i />
                  <i />
                  <i />
                  <b>100+</b>
                </div>
                <span className="visual-caption">RESEARCH / STRUCTURED</span>
              </>
            )}
          </div>
          <div className="impact-strip">
            <span>THE RESULT</span>
            <strong>{project.impact}</strong>
          </div>
          <h4>Behind the build</h4>
          <p>{project.description}</p>
          <ul className="technology-list" aria-label="Technology stack">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          {project.githubUrl && (
            <a
              className="ink-button"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              Explore the code <span>↗</span>
            </a>
          )}
        </article>
      </div>
    );
  if (section === "profile")
    return (
      <article className="profile-view">
        <p className="panel-eyebrow">PLAYER FILE / ONTARIO, CANADA</p>
        <h3>
          Hi, I&apos;m Faiz.
          <br />
          <em>I build useful things.</em>
        </h3>
        <p className="project-lead">
          AI Engineer. Software Engineer. Curious by default.
        </p>
        <p>
          I use AI and software to solve real-world problems — from computer
          vision that helps people focus to agents that turn complex workflows
          into something simple.
        </p>
        <div className="profile-stats">
          <div>
            <strong>3.78</strong>
            <span>GPA</span>
          </div>
          <div>
            <strong>Dean&apos;s List</strong>
            <span>ACADEMIC STANDING</span>
          </div>
          <div>
            <strong>2027</strong>
            <span>EXPECTED GRADUATION</span>
          </div>
        </div>
        <h4>Currently at Ontario Tech</h4>
        <p>
          B.Sc. Computer Science, Honours Co-op. Exploring AI engineering,
          systems design, and the space where ambitious ideas become working
          products.
        </p>
        <div className="panel-actions">
          <a
            className="ink-button"
            href="/resume.md"
            download="Faiz-Kerawala-Resume.md"
          >
            Download resume <small>.md</small>
            <span>↓</span>
          </a>
          <button className="text-button" onClick={() => onOpen("contact")}>
            Let&apos;s talk ↗
          </button>
        </div>
      </article>
    );
  if (section === "skills")
    return (
      <div>
        <p className="panel-eyebrow">THE WORKSHOP / TOOLS OF THE TRADE</p>
        <p className="project-lead">
          A toolkit for turning ideas into systems.
        </p>
        <div className="skill-inventory">
          {skillGroups.map((group, i) => (
            <article key={group.label}>
              <span className="inventory-number">0{i + 1}</span>
              <div>
                <h3>{group.label}</h3>
                <ul className="technology-list">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <button className="ink-button" onClick={() => onOpen("projects")}>
          See these tools in action <span>↗</span>
        </button>
      </div>
    );
  if (section === "experience")
    return (
      <div>
        <p className="panel-eyebrow">THE ARCHIVE / EXPERIENCE & EDUCATION</p>
        <p className="project-lead">
          Learning by building. Growing by shipping.
        </p>
        <div className="experience-records">
          {experience.map((item, i) => (
            <article key={item.id}>
              <span className="record-index">0{i + 1}</span>
              <div>
                <p className="record-date">
                  {item.period} / {item.location}
                </p>
                <h3>{item.company}</h3>
                <h4>{item.role}</h4>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <ul className="technology-list">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  if (section === "stealth")
    return (
      <article className="signal-view">
        <p className="panel-eyebrow">SIGNAL OBSERVATORY / CURRENTLY BUILDING</p>
        <div className="signal-mark" aria-hidden="true">
          <span>?</span>
          <i />
          <i />
        </div>
        <h3>
          Something big
          <br />
          <em>is on the horizon.</em>
        </h3>
        <p className="project-lead">ContentSpy. Launching soon.</p>
        <p>
          The next chapter is taking shape. Take a look at what&apos;s coming.
        </p>
        <a
          className="ink-button"
          href="https://contentspy.me"
          target="_blank"
          rel="noreferrer"
        >
          Visit ContentSpy <span>↗</span>
        </a>
      </article>
    );
  if (section === "contact")
    return (
      <article className="contact-view">
        <p className="panel-eyebrow">HARBOR TERRACE / MAKE A CONNECTION</p>
        <h3>
          Good things start
          <br />
          <em>with a conversation.</em>
        </h3>
        <p className="project-lead">
          An idea, a role, or a project. I&apos;m listening.
        </p>
        <a className="contact-email" href="mailto:faiz.kera@gmail.com">
          faiz.kera@gmail.com <span>↗</span>
        </a>
        <div className="contact-links">
          {socialLinks
            .filter((link) => link.kind !== "email")
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{link.label}</span>
                <span>↗</span>
              </a>
            ))}
          <a href="/resume.md" download="Faiz-Kerawala-Resume.md">
            <span>
              Resume <small>(Markdown)</small>
            </span>
            <span>↓</span>
          </a>
        </div>
        <p className="contact-note">
          Based in Ontario, Canada.
          <br />
          Building for wherever the next idea takes me.
        </p>
      </article>
    );
  if (section === "map")
    return (
      <div>
        <p className="panel-eyebrow">
          CAMPUS DIRECTORY / CHOOSE YOUR NEXT STOP
        </p>
        <p className="project-lead">A little world. A lot to discover.</p>
        <div className="travel-directory">
          {destinations.map((d) => (
            <article key={d.id}>
              <span>{d.number}</span>
              <div>
                <h3>{d.name}</h3>
                <p>{d.title}</p>
              </div>
              <button className="text-button" onClick={() => onOpen(d.id)}>
                Browse ↗
              </button>
              <button className="ink-button" onClick={() => onTravel(d.id)}>
                Travel →
              </button>
            </article>
          ))}
        </div>
      </div>
    );
  return null;
}
