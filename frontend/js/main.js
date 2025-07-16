import { searchEntry, createEntry } from "./components.js";

function search() {
  const v = document.getElementById("searchInput").value;
  const searchlist = document.getElementById("searchlist");
  const list = document.getElementById("list");
  if (v === "") {
    enableSearchMode(true);
    return;
  }
  list.classList.add("invisible");
  searchlist.classList.remove("invisible");
  searchlist.innerHTML = "";
  searchlist.appendChild(searchEntry(v));
}

function enableSearchMode(on) {
  if (on) {
    list.classList.add("invisible");
    searchlist.classList.remove("invisible");
    searchlist.innerHTML = "";
    return;
  }

  list.classList.remove("invisible");
  searchlist.classList.add("invisible");
  list.innerHTML = "";
}

async function renderList() {
  fetch("/api/v1/entries")
    .then((response) => response.json())
    .then((json) => {
      const l = document.getElementById("list");
      nodes = json.map((x) => createEntry(x));
      l.replaceChildren(l);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderList();
});

export function addEntry() {
  const name = document.getElementById("searchInput").value;
  fetch("/api/v1/entries", {
    method: "POST",
    body: JSON.stringify({
      Name: name,
      Number: 1,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((_) => {
      renderList();
    });
}
