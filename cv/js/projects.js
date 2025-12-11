// js/projects.js

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("projects-container");
  if (!container) return;

  try {
    const res = await fetch("data/projects.json");
    if (!res.ok) {
      container.textContent = "No se pudo cargar la lista de proyectos.";
      return;
    }

    const data = await res.json();
    if (!data.groups || !Array.isArray(data.groups)) {
      container.textContent = "Formato de proyectos inválido.";
      return;
    }

    data.groups.forEach((group) => {
      createGroupSection(container, group);
    });
  } catch (err) {
    console.error(err);
    container.textContent = "Error al cargar los proyectos.";
  }
});

function createGroupSection(container, group) {
  const section = document.createElement("section");
  section.className = "project-group";

  // Header
  const headerBtn = document.createElement("button");
  headerBtn.type = "button";
  headerBtn.className = "project-group__header";
  headerBtn.setAttribute("aria-expanded", "true");

  const titleSpan = document.createElement("span");
  titleSpan.className = "project-group__title";
  titleSpan.textContent = group.title || "Grupo sin título";

  const iconSpan = document.createElement("span");
  iconSpan.className = "project-group__icon";
  iconSpan.textContent = "−";

  headerBtn.appendChild(titleSpan);
  headerBtn.appendChild(iconSpan);

  const body = document.createElement("div");
  body.className = "project-group__body";

  if (group.description) {
    const desc = document.createElement("p");
    desc.className = "project-group__description";
    desc.textContent = group.description;
    body.appendChild(desc);
  }

  const list = document.createElement("div");
  list.className = "project-list";

  const projects = Array.isArray(group.projects) ? group.projects : [];
  projects.forEach((proj) => {
    const card = createProjectCard(group.folder, proj);
    list.appendChild(card);
  });

  body.appendChild(list);

  // Toggle + / -
  headerBtn.addEventListener("click", () => {
    const isHidden = body.style.display === "none";
    body.style.display = isHidden ? "block" : "none";
    iconSpan.textContent = isHidden ? "−" : "+";
    headerBtn.setAttribute("aria-expanded", String(isHidden));
  });

  section.appendChild(headerBtn);
  section.appendChild(body);
  container.appendChild(section);
}

function createProjectCard(baseFolder, proj) {
  const card = document.createElement("article");
  card.className = "project-card";

  const name = document.createElement("h3");
  name.className = "project-card__name";
  name.textContent = proj.name || "Proyecto sin nombre";

  const meta = document.createElement("p");
  meta.className = "project-card__meta";
  const year = proj.year ? proj.year : "";
  const semester = proj.semester ? proj.semester : "";
  const status = proj.status ? ` · ${proj.status}` : "";
  meta.textContent = `${year}${year && semester ? " – " : ""}${semester}${status}`;

  const projectPath = `${baseFolder}/${proj.folderName || ""}`.replace(/\/+$/, "");

  // Imagen opcional
  if (proj.image) {
    const img = document.createElement("img");
    img.className = "project-card__thumb";
    img.src = `${projectPath}/${proj.image}`;
    img.alt = `Vista previa de ${proj.name || "proyecto"}`;
    card.appendChild(img);
  }

  const desc = document.createElement("p");
  desc.className = "project-card__desc";
  desc.textContent = "Cargando descripción...";

  const tagsWrapper = document.createElement("div");
  tagsWrapper.className = "project-card__tags";
  if (Array.isArray(proj.tech)) {
    proj.tech.forEach((t) => {
      const tag = document.createElement("span");
      tag.className = "project-tag";
      tag.textContent = t;
      tagsWrapper.appendChild(tag);
    });
  }

  const linksWrapper = document.createElement("div");
  linksWrapper.className = "project-card__link-group";

  const isNeon = proj.folderName === "neon-dodge";

  // 🔹 Caso especial: Neon Dodge → solo vista en navegador
  if (isNeon && proj.openFile) {
    const previewLink = document.createElement("a");
    const previewHref = `${projectPath}/${proj.openFile}`;
    previewLink.href = previewHref;
    previewLink.target = "_blank";
    previewLink.rel = "noopener noreferrer";
    previewLink.className = "project-card__link";
    previewLink.textContent = "Ver en navegador";
    linksWrapper.appendChild(previewLink);
  }
  // 🔹 Resto de proyectos → solo botón de descarga (.zip)
  else if (proj.download) {
    const isFullUrl = /^https?:\/\//i.test(proj.download);
    const href = isFullUrl ? proj.download : `${projectPath}/${proj.download}`;

    const downloadLink = document.createElement("a");
    downloadLink.href = href;
    downloadLink.className = "project-card__link";
    downloadLink.textContent = "Descargar proyecto (.zip)";

    if (!isFullUrl) {
      downloadLink.setAttribute("download", "");
    } else {
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";
    }

    linksWrapper.appendChild(downloadLink);
  }
  // Si algún proyecto no tiene ni download ni es Neon, no mostramos botones (raro, pero no rompe nada)

  // Pintar en la tarjeta
  card.appendChild(name);
  card.appendChild(meta);
  card.appendChild(desc);
  if (proj.tech && proj.tech.length > 0) {
    card.appendChild(tagsWrapper);
  }
  card.appendChild(linksWrapper);

  // Cargar info.txt
  const infoUrl = `${projectPath}/info.txt`;
  fetch(infoUrl)
    .then((r) => {
      if (!r.ok) throw new Error("No info.txt");
      return r.text();
    })
    .then((text) => {
      desc.textContent = text.trim() || "Sin descripción.";
    })
    .catch(() => {
      desc.textContent = "Sin descripción (no se encontró info.txt).";
    });

  return card;
}
