function search() {
  const v = document.getElementById("search").value;
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

function searchEntry(entry) {
  const li = document.createElement("li");

  const div = document.createElement("div");
  div.textContent = entry;
  li.appendChild(div);

  const button = document.createElement("button");
  button.textContent = "Add";
  button.onclick = async () => {
    await addEntry(entry);
    const s = document.getElementById("search");
    s.value = "";
    renderList();
    enableSearchMode(false);
  };
  li.appendChild(button);
  return li;
}

async function addEntry(entry) {
  const response = await fetch("/api/v1/entries", {
    method: "POST",
    body: JSON.stringify({
      Name: entry,
      Number: 1,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // TODO: Error handling
  return await response.json();
}

async function renderList() {
  const l = document.getElementById("list");
  l.innerHTML = "";
  const entries = await getEntries();
  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry.Name;
    l.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderList();
});

async function getEntries() {
  const response = await fetch("/api/v1/entries");
  // TODO: Error handling
  return await response.json();
}
