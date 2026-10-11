import { useEffect, useMemo, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CalendarDays,
  BookOpenCheck,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  MapPin,
  Clock3,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
  Circle,
  GraduationCap,
  Target,
  TrendingUp,
  ChevronDown,
  Menu,
} from "lucide-react";

const initialJobs = [
  {
    id: 1,
    company: "Infosys",
    role: "Systems Engineer",
    location: "Bengaluru",
    package: 3.6,
    status: "INTERVIEW",
    appliedDate: "2026-10-02",
    interviewDate: "2026-10-15",
    color: "blue",
    initials: "I",
  },
  {
    id: 2,
    company: "TCS",
    role: "Assistant System Engineer",
    location: "Bengaluru",
    package: 3.8,
    status: "APPLIED",
    appliedDate: "2026-10-04",
    interviewDate: "",
    color: "purple",
    initials: "T",
  },
  {
    id: 3,
    company: "Accenture",
    role: "Associate Software Engineer",
    location: "Hybrid",
    package: 4.5,
    status: "ASSESSMENT",
    appliedDate: "2026-10-05",
    interviewDate: "2026-10-18",
    color: "orange",
    initials: "A",
  },
  {
    id: 4,
    company: "Wipro",
    role: "Project Engineer",
    location: "Mysuru",
    package: 3.5,
    status: "APPLIED",
    appliedDate: "2026-10-06",
    interviewDate: "",
    color: "green",
    initials: "W",
  },
];
const prepItems = [
  { id: 1, label: "Java fundamentals", category: "Core Java", done: true },
  {
    id: 2,
    label: "Arrays & Strings — 10 problems",
    category: "DSA",
    done: true,
  },
  {
    id: 3,
    label: "Aptitude: percentages & ratios",
    category: "Aptitude",
    done: false,
  },
  {
    id: 4,
    label: "Practice explaining a project",
    category: "Interview",
    done: false,
  },
];
const statusLabels = {
  APPLIED: "Applied",
  ASSESSMENT: "Assessment",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

function loadJobs() {
  try {
    const stored = localStorage.getItem("careertrack-jobs");
    return stored ? JSON.parse(stored) : initialJobs;
  } catch {
    return initialJobs;
  }
}
function App() {
  const [jobs, setJobs] = useState([]);
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("careertrack-user")) || null;
    } catch {
      return null;
    }
  });

  const [authPage, setAuthPage] = useState("login");
  const userInitials = (authUser?.name || "User")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  useEffect(() => {
    fetch("http://localhost:8080/api/applications")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load applications");
        }
        return response.json();
      })
      .then((data) => {
        const applications = data.map((job) => ({
          ...job,
          package: Number(job.packageLpa) || 0,
          initials: job.company?.[0]?.toUpperCase() || "?",
          color: "blue",
        }));

        setJobs(applications);
      })
      .catch((error) => {
        console.error("Could not load applications:", error);
        alert(
          "Could not load applications. Check that Spring Boot is running.",
        );
      });
  }, []);

  const [prep, setPrep] = useState(prepItems);
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    package: "",
    status: "APPLIED",
    appliedDate: new Date().toISOString().slice(0, 10),
    interviewDate: "",
  });

  const saveJobs = (next) => {
    setJobs(next);
    localStorage.setItem("careertrack-jobs", JSON.stringify(next));
  };
  const filteredJobs = useMemo(
    () =>
      jobs.filter((j) => {
        const matches = `${j.company} ${j.role} ${j.location}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matches && (filter === "ALL" || j.status === filter);
      }),
    [jobs, query, filter],
  );
  const interviews = jobs.filter(
    (j) => j.interviewDate && ["INTERVIEW", "ASSESSMENT"].includes(j.status),
  ).length;
  const offers = jobs.filter((j) => j.status === "OFFER").length;
  const openForm = (job) => {
    setEditing(job || null);
    setForm(
      job
        ? { ...job, package: job.package ?? "" }
        : {
            company: "",
            role: "",
            location: "",
            package: "",
            status: "APPLIED",
            appliedDate: new Date().toISOString().slice(0, 10),
            interviewDate: "",
          },
    );
    setShowModal(true);
  };

  const submitJob = async (e) => {
    e.preventDefault();

    if (!form.company.trim() || !form.role.trim()) return;

    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location || "",
      packageLpa: Number(form.package) || 0,
      status: form.status || "APPLIED",
      appliedDate: form.appliedDate || null,
      interviewDate: form.interviewDate || null,
    };

    try {
      const url = editing
        ? `http://localhost:8080/api/applications/${editing.id}`
        : "http://localhost:8080/api/applications";

      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const saved = await response.json();

      const job = {
        ...saved,
        package: Number(saved.packageLpa) || 0,
        initials: saved.company[0].toUpperCase(),
        color:
          editing?.color ||
          ["blue", "purple", "orange", "green"][jobs.length % 4],
      };

      if (editing) {
        saveJobs(jobs.map((j) => (j.id === editing.id ? job : j)));
      } else {
        saveJobs([job, ...jobs]);
      }

      setShowModal(false);
    } catch (error) {
      alert(`Could not save application: ${error.message}`);
    }
  };

  const removeJob = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/applications/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      saveJobs(jobs.filter((j) => j.id !== id));
    } catch (error) {
      alert(`Could not delete application: ${error.message}`);
    }
  };

  const togglePrep = (id) =>
    setPrep(prep.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));
  const completed = prep.filter((p) => p.done).length;
  const nav = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Applications", icon: BriefcaseBusiness },
    { label: "Preparation", icon: BookOpenCheck },
    { label: "Interviews", icon: CalendarDays },
  ];

  if (!authUser) {
    return authPage === "login" ? (
      <Login
        onLogin={(user) => {
          localStorage.setItem("careertrack-user", JSON.stringify(user));
          setAuthUser(user);
        }}
        onShowRegister={() => setAuthPage("register")}
      />
    ) : (
      <Register
        onRegister={() => setAuthPage("login")}
        onShowLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Target size={21} />
          </div>
          <span>
            career<span className="brand-accent">track</span>
          </span>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map((n) => (
            <button
              key={n.label}
              className={`nav-item ${active === n.label ? "selected" : ""}`}
              onClick={() => {
                setActive(n.label);
                setMobileNav(false);
              }}
            >
              <n.icon size={18} />
              <span>{n.label}</span>
              {n.label === "Applications" && (
                <span className="nav-count">{jobs.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="goal-card">
            <div className="goal-icon">
              <GraduationCap size={18} />
            </div>
            <strong>Placement goal</strong>
            <p>
              Stay consistent. Your next opportunity is closer than you think.
            </p>
            <div className="goal-progress">
              <span
                style={{ width: `${Math.min(100, jobs.length * 10 + 20)}%` }}
              />
            </div>
            <small>{jobs.length} applications tracked</small>
          </div>
          <button
            className="nav-item muted"
            onClick={() => setActive("Settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className="profile">
            <div className="avatar">{userInitials}</div>
            <div className="profile-info">
              <strong>{authUser.name}</strong>
              <span>{authUser.email}</span>
            </div>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("careertrack-user");
                setAuthUser(null);
                setAuthPage("login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu icon-btn"
            onClick={() => setMobileNav(!mobileNav)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{active}</strong>
          </div>
          <div className="top-actions">
            <div className="search-box">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search applications..."
              />
            </div>
            <button
              className="icon-btn notification"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="top-avatar">{userInitials}</div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot" /> YOUR CAREER WORKSPACE
              </div>
              <h1>
                {active === "Overview"
                  ? `${
                      new Date().getHours() < 12
                        ? "Good morning"
                        : new Date().getHours() < 17
                          ? "Good afternoon"
                          : "Good evening"
                    }, ${authUser.name}`
                  : active}
              </h1>
              <p className="subheading">
                {active === "Overview"
                  ? "Small steps every day lead to big opportunities. Here’s your progress."
                  : pageDescription(active)}
              </p>
            </div>
            <button className="primary-btn" onClick={() => openForm()}>
              <Plus size={17} /> Add application
            </button>
          </section>

          {active === "Overview" && (
            <>
              <section className="stats-grid">
                <Stat
                  icon={BriefcaseBusiness}
                  label="Total applications"
                  value={jobs.length}
                  delta="Your active job pipeline"
                  tint="lavender"
                />
                <Stat
                  icon={CalendarDays}
                  label="Interviews & tests"
                  value={interviews}
                  delta="Keep your calendar ready"
                  tint="blue-tint"
                />
                <Stat
                  icon={CheckCircle2}
                  label="Offers received"
                  value={offers}
                  delta={
                    offers ? "Congratulations!" : "Your goal is within reach"
                  }
                  tint="mint"
                />
                <Stat
                  icon={TrendingUp}
                  label="Prep completed"
                  value={`${Math.round((completed / prep.length) * 100)}%`}
                  delta={`${completed} of ${prep.length} tasks complete`}
                  tint="peach"
                />
              </section>
              <section className="dashboard-grid">
                <div className="panel applications-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent applications</h2>
                      <p>Keep every opportunity moving forward.</p>
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => setActive("Applications")}
                    >
                      View all <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <div className="filter-row">
                    {["ALL", "APPLIED", "ASSESSMENT", "INTERVIEW", "OFFER"].map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setFilter(s);
                            setActive("Applications");
                          }}
                          className={`filter-chip ${filter === s ? "active" : ""}`}
                        >
                          {s === "ALL" ? "All" : statusLabels[s]}
                        </button>
                      ),
                    )}
                  </div>
                  <JobTable
                    jobs={jobs.slice(0, 4)}
                    onEdit={openForm}
                    onDelete={removeJob}
                  />
                  {jobs.length === 0 && <EmptyState onAdd={() => openForm()} />}
                </div>
                <div className="panel prep-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Today's preparation</h2>
                      <p>Build skills one session at a time.</p>
                    </div>
                    <span className="date-pill">TODAY</span>
                  </div>
                  <div className="prep-summary">
                    <div
                      className="prep-ring"
                      style={{
                        "--progress": `${(completed / prep.length) * 100}%`,
                      }}
                    >
                      <div>
                        <strong>
                          {completed}/{prep.length}
                        </strong>
                        <small>done</small>
                      </div>
                    </div>
                    <div>
                      <strong>
                        {completed === prep.length
                          ? "All tasks complete!"
                          : "You’re making progress"}
                      </strong>
                      <p>
                        {prep.length - completed} tasks left on your checklist
                      </p>
                    </div>
                  </div>
                  <div className="prep-list">
                    {prep.map((p) => (
                      <button
                        key={p.id}
                        className={`prep-item ${p.done ? "done" : ""}`}
                        onClick={() => togglePrep(p.id)}
                      >
                        {p.done ? (
                          <CheckCircle2 size={19} />
                        ) : (
                          <Circle size={19} />
                        )}
                        <span>
                          <strong>{p.label}</strong>
                          <small>{p.category}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="secondary-btn full"
                    onClick={() => setActive("Preparation")}
                  >
                    Open preparation plan <ArrowUpRight size={15} />
                  </button>
                </div>
              </section>
              <section className="bottom-grid">
                <div className="panel tip-card">
                  <div className="tip-icon">
                    <Target size={20} />
                  </div>
                  <div>
                    <span className="eyebrow">CAREER TIP</span>
                    <h3>Consistency beats cramming.</h3>
                    <p>
                      Set aside 30 minutes today for coding practice and one
                      interview question. Track it, then repeat tomorrow.
                    </p>
                  </div>
                </div>
                <div className="panel upcoming-card">
                  <div className="panel-heading">
                    <div>
                      <h2>Upcoming dates</h2>
                      <p>Important next steps</p>
                    </div>
                    <CalendarDays size={18} className="soft-icon" />
                  </div>
                  {jobs.filter((j) => j.interviewDate).length === 0 ? (
                    <p className="muted-text">
                      Add interview dates to see them here.
                    </p>
                  ) : (
                    jobs
                      .filter((j) => j.interviewDate)
                      .slice(0, 3)
                      .map((j) => (
                        <div className="upcoming-item" key={j.id}>
                          <div className="mini-date">
                            <strong>
                              {new Date(
                                j.interviewDate + "T00:00:00",
                              ).getDate()}
                            </strong>
                            <span>
                              {new Date(
                                j.interviewDate + "T00:00:00",
                              ).toLocaleString("en", { month: "short" })}
                            </span>
                          </div>
                          <div>
                            <strong>{j.company}</strong>
                            <p>{j.role}</p>
                          </div>
                          <span className="upcoming-kind">
                            {statusLabels[j.status]}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </section>
            </>
          )}

          {active === "Applications" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h2>All applications</h2>
                  <p>Manage your job search from one place.</p>
                </div>
                <select
                  className="select-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">All statuses</option>
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <JobTable
                jobs={filteredJobs}
                onEdit={openForm}
                onDelete={removeJob}
              />
              {filteredJobs.length === 0 && (
                <EmptyState onAdd={() => openForm()} />
              )}
            </section>
          )}
          {active === "Preparation" && (
            <section className="prep-page-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Preparation checklist</h2>
                    <p>Mark each task as you complete it.</p>
                  </div>
                </div>
                <div className="large-progress">
                  <div>
                    <span>Overall progress</span>
                    <strong>
                      {Math.round((completed / prep.length) * 100)}%
                    </strong>
                  </div>
                  <div className="bar">
                    <span
                      style={{ width: `${(completed / prep.length) * 100}%` }}
                    />
                  </div>
                </div>
                {prep.map((p) => (
                  <button
                    key={p.id}
                    className={`prep-item page-prep ${p.done ? "done" : ""}`}
                    onClick={() => togglePrep(p.id)}
                  >
                    {p.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    <span>
                      <strong>{p.label}</strong>
                      <small>{p.category}</small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="panel focus-card">
                <div className="focus-art">
                  <BookOpenCheck size={38} />
                </div>
                <h2>Make progress visible.</h2>
                <p>
                  Use a small, repeatable study plan. Your checklist is saved
                  for this session.
                </p>
                <div className="focus-stat">
                  <span>Tasks completed</span>
                  <strong>
                    {completed} / {prep.length}
                  </strong>
                </div>
              </div>
            </section>
          )}
          {active === "Interviews" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h2>Interview calendar</h2>
                  <p>Applications with assessment or interview dates.</p>
                </div>
              </div>
              {jobs.filter((j) => j.interviewDate).length === 0 ? (
                <EmptyState onAdd={() => openForm()} />
              ) : (
                jobs
                  .filter((j) => j.interviewDate)
                  .sort((a, b) =>
                    a.interviewDate.localeCompare(b.interviewDate),
                  )
                  .map((j) => (
                    <div className="interview-row" key={j.id}>
                      <div className="mini-date large-date">
                        <strong>
                          {new Date(j.interviewDate + "T00:00:00").getDate()}
                        </strong>
                        <span>
                          {new Date(
                            j.interviewDate + "T00:00:00",
                          ).toLocaleString("en", { month: "short" })}
                        </span>
                      </div>
                      <div className={`company-logo ${j.color}`}>
                        {j.initials}
                      </div>
                      <div className="interview-details">
                        <strong>
                          {j.company} — {j.role}
                        </strong>
                        <p>
                          <CalendarDays size={14} /> {j.interviewDate}{" "}
                          <span>•</span> <MapPin size={14} />{" "}
                          {j.location || "Location not set"}
                        </p>
                      </div>
                      <StatusBadge status={j.status} />
                      <button
                        className="icon-btn"
                        onClick={() => openForm(j)}
                        aria-label="Edit interview"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  ))
              )}
            </section>
          )}
          {active === "Settings" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h2>Settings</h2>
                  <p>Starter project preferences.</p>
                </div>
              </div>
              <div className="setting-row">
                <div>
                  <strong>Local demo data</strong>
                  <p>
                    Applications are saved in this browser using localStorage.
                  </p>
                </div>
                <button
                  className="secondary-btn"
                  onClick={() => {
                    localStorage.removeItem("careertrack-jobs");
                    setJobs(initialJobs);
                    setFilter("ALL");
                  }}
                >
                  Reset demo data
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <strong>Backend API</strong>
                  <p>
                    Spring Boot API is configured for http://localhost:8080.
                  </p>
                </div>
                <span className="status-tag">Starter setup</span>
              </div>
            </section>
          )}
        </div>
        <footer className="footer">
          <span>© 2026 CareerTrack</span>
          <span>
            Built for your next opportunity <span className="heart">♥</span>
          </span>
        </footer>
      </main>

      {showModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <form className="modal" onSubmit={submitJob}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">JOB PIPELINE</span>
                <h2>{editing ? "Edit application" : "Add an application"}</h2>
                <p>Keep your job search organized.</p>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={19} />
              </button>
            </div>
            <div className="form-grid">
              <label>
                Company name *
                <input
                  required
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="e.g. Infosys"
                />
              </label>
              <label>
                Job role *
                <input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Software Engineer"
                />
              </label>
              <label>
                Location
                <input
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="e.g. Bengaluru"
                />
              </label>
              <label>
                Package (LPA)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.package}
                  onChange={(e) =>
                    setForm({ ...form, package: e.target.value })
                  }
                  placeholder="e.g. 4.5"
                />
              </label>
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Applied date
                <input
                  type="date"
                  value={form.appliedDate || ""}
                  onChange={(e) =>
                    setForm({ ...form, appliedDate: e.target.value })
                  }
                />
              </label>
              <label className="wide">
                Interview / assessment date
                <input
                  type="date"
                  value={form.interviewDate || ""}
                  onChange={(e) =>
                    setForm({ ...form, interviewDate: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="primary-btn" type="submit">
                {editing ? "Save changes" : "Add application"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function pageDescription(active) {
  return (
    {
      Applications:
        "Every application, status, and next step in one organized view.",
      Preparation: "Keep building the skills that help you stand out.",
      Interviews: "Prepare ahead and never lose track of an important date.",
      Settings: "Manage your local CareerTrack workspace.",
    }[active] || "Your career workspace."
  );
}
function Stat({ icon: Icon, label, value, delta, tint }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tint}`}>
        <Icon size={19} />
      </div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-delta">{delta}</span>
    </div>
  );
}
function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status?.toLowerCase()}`}>
      {statusLabels[status] || status}
    </span>
  );
}
function JobTable({ jobs, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>COMPANY / ROLE</th>
            <th>PACKAGE</th>
            <th>STATUS</th>
            <th>APPLIED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>
                <div className="company-cell">
                  <div className={`company-logo ${j.color || "blue"}`}>
                    {j.initials || j.company?.[0]}
                  </div>
                  <div>
                    <strong>{j.company}</strong>
                    <span>{j.role}</span>
                  </div>
                </div>
              </td>
              <td>
                <strong className="package-value">
                  {j.package ? `₹${j.package} LPA` : "—"}
                </strong>
                <span className="cell-sub">
                  {j.location || "Location not set"}
                </span>
              </td>
              <td>
                <StatusBadge status={j.status} />
              </td>
              <td>
                <span className="date-value">{j.appliedDate || "—"}</span>
              </td>
              <td>
                <div className="row-actions">
                  <button
                    className="icon-btn small"
                    title="Edit"
                    onClick={() => onEdit(j)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="icon-btn small danger-hover"
                    title="Delete"
                    onClick={() => {
                      if (confirm(`Delete ${j.company} application?`))
                        onDelete(j.id);
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function EmptyState({ onAdd }) {
  return (
    <div className="empty-state">
      <BriefcaseBusiness size={28} />
      <strong>No applications found</strong>
      <p>Add your first job application to get started.</p>
      <button className="primary-btn" onClick={onAdd}>
        <Plus size={16} /> Add application
      </button>
    </div>
  );
}
export default App;
