
"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";

type Project = {
  id: number;
  name: string;
  status: string;
};

type Task = {
  id: number;
  title: string;
  projectId: number;
  priority: string;
  status: string;
  dueDate: string;
};

const initialProjects: Project[] = [
  { id: 1, name: "ANT Digital Office", status: "In Progress" },
  { id: 2, name: "ANT Legal Suite", status: "Planned" },
  { id: 3, name: "ANT Cooperative Suite", status: "Planned" },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Menyelesaikan fondasi Workspace",
    projectId: 1,
    priority: "High",
    status: "In Progress",
    dueDate: "",
  },
  {
    id: 2,
    title: "Merancang struktur database",
    projectId: 1,
    priority: "High",
    status: "Planned",
    dueDate: "",
  },
  {
    id: 3,
    title: "Menyusun kebutuhan produk",
    projectId: 2,
    priority: "Medium",
    status: "Planned",
    dueDate: "",
  },
];

const statuses = ["Planned", "In Progress", "Review", "Done"];

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid var(--border, #d1d5db)",
  cursor: "pointer",
  fontWeight: 600 as const,
};

export default function Page() {
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskProject, setTaskProject] = useState("1");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("ant-workspace-projects");
      const savedTasks = localStorage.getItem("ant-workspace-tasks");

      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch {
      // Gunakan data awal jika data browser tidak dapat dibaca.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("ant-workspace-projects", JSON.stringify(projects));
    localStorage.setItem("ant-workspace-tasks", JSON.stringify(tasks));
  }, [projects, tasks, ready]);

  const visibleTasks = tasks.filter((task) => {
    const project = projects.find((item) => item.id === task.projectId);
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (project?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "All" || task.status === filter;
    return matchesSearch && matchesStatus;
  });

  function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = projectName.trim();
    if (!name) return;

    setProjects((current) => [
      ...current,
      { id: Date.now(), name, status: "Planned" },
    ]);
    setProjectName("");
    setShowProjectForm(false);
  }

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title || projects.length === 0) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        projectId: Number(taskProject),
        priority: taskPriority,
        status: "Planned",
        dueDate: taskDueDate,
      },
    ]);
    setTaskTitle("");
    setTaskDueDate("");
    setShowTaskForm(false);
  }

  function updateTask(id: number, status: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task))
    );
  }

  const cardStyle = {
    border: "1px solid var(--border, #e5e7eb)",
    borderRadius: 12,
    padding: 18,
    minWidth: 0,
  };

  const fieldStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid var(--border, #d1d5db)",
    background: "var(--card, transparent)",
    color: "inherit",
    boxSizing: "border-box" as const,
  };

  return (
    <AppShell>
      <div className="top">
        <div>
          <div className="eyebrow">ANT Digital Office</div>
          <h1 className="title">Workspace</h1>
          <div className="subtitle">
            Pusat pengelolaan proyek dan pekerjaan ANT.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
        <button style={buttonStyle} onClick={() => setShowProjectForm(!showProjectForm)}>
          + Tambah Proyek
        </button>
        <button
          style={{ ...buttonStyle, background: "#172554", color: "white" }}
          onClick={() => setShowTaskForm(!showTaskForm)}
        >
          + Tambah Tugas
        </button>
      </div>

      {showProjectForm && (
        <form onSubmit={addProject} style={{ ...cardStyle, marginBottom: 18 }}>
          <h3>Proyek Baru</h3>
          <input
            style={fieldStyle}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Nama proyek"
            required
          />
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="submit" style={buttonStyle}>Simpan Proyek</button>
            <button type="button" style={buttonStyle} onClick={() => setShowProjectForm(false)}>Batal</button>
          </div>
        </form>
      )}

      {showTaskForm && (
        <form onSubmit={addTask} style={{ ...cardStyle, marginBottom: 18 }}>
          <h3>Tugas Baru</h3>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              style={fieldStyle}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Nama tugas"
              required
            />
            <label>
              Proyek
              <select style={fieldStyle} value={taskProject} onChange={(e) => setTaskProject(e.target.value)}>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label>
              Prioritas
              <select style={fieldStyle} value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </label>
            <label>
              Tenggat waktu (opsional)
              <input style={fieldStyle} type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
            </label>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button type="submit" style={buttonStyle}>Simpan Tugas</button>
            <button type="button" style={buttonStyle} onClick={() => setShowTaskForm(false)}>Batal</button>
          </div>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Proyek", value: projects.length },
          { label: "Total Tugas", value: tasks.length },
          { label: "Sedang Dikerjakan", value: tasks.filter((t) => t.status === "In Progress").length },
          { label: "Selesai", value: tasks.filter((t) => t.status === "Done").length },
        ].map((item) => (
          <div key={item.label} style={cardStyle}>
            <div className="subtitle">{item.label}</div>
            <div style={{ fontSize: 28, fontWeight: 750, marginTop: 8 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <section style={{ ...cardStyle, marginBottom: 22 }}>
        <h2 style={{ marginTop: 0 }}>Daftar Proyek</h2>
        {projects.length === 0 ? (
          <p className="subtitle">Belum ada proyek. Tambahkan proyek pertama.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {projects.map((project) => {
              const projectTasks = tasks.filter((task) => task.projectId === project.id);
              const completed = projectTasks.filter((task) => task.status === "Done").length;
              const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;

              return (
                <div key={project.id} style={{ padding: 12, borderRadius: 8, background: "var(--muted, rgba(127,127,127,.07))" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <strong>{project.name}</strong>
                    <span className="subtitle">{project.status}</span>
                  </div>
                  <div className="subtitle" style={{ marginTop: 6 }}>
                    {projectTasks.length} tugas · {progress}% selesai
                  </div>
                  <div style={{ height: 6, borderRadius: 9, background: "rgba(127,127,127,.2)", marginTop: 8, overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "#16a34a" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Daftar Tugas</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 16 }}>
          <input style={fieldStyle} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari tugas atau proyek..." />
          <select style={fieldStyle} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">Semua Status</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>

        {visibleTasks.length === 0 ? (
          <p className="subtitle">Tidak ada tugas yang cocok dengan pencarian.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {visibleTasks.map((task) => {
              const project = projects.find((item) => item.id === task.projectId);
              return (
                <div key={task.id} style={{ border: "1px solid var(--border, #e5e7eb)", borderRadius: 10, padding: 14 }}>
                  <strong>{task.title}</strong>
                  <div className="subtitle" style={{ marginTop: 5 }}>
                    {project?.name ?? "Proyek tidak ditemukan"} · Prioritas: {task.priority}
                    {task.dueDate ? ` · Tenggat: ${task.dueDate}` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
                    <label style={{ flex: "1 1 170px" }}>
                      <span className="subtitle">Status tugas</span>
                      <select style={fieldStyle} value={task.status} onChange={(e) => updateTask(task.id, e.target.value)}>
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <p className="subtitle" style={{ marginTop: 18 }}>
        Versi fondasi: data saat ini tersimpan di browser yang digunakan, belum dibagikan ke pengguna lain melalui database.
      </p>
    </AppShell>
  );
}
