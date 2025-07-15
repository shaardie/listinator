import { searchEntry, createEntry } from "./components.js";
import { getEntries } from "./api.js";

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
  const l = document.getElementById("list");
  l.innerHTML = "";
  const entries = await getEntries();
  entries.forEach((entry) => {
    l.appendChild(createEntry(entry));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderList();
});
