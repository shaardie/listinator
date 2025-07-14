function search() {
  const v = document.getElementById("search").value;
  const searchlist = document.getElementById("searchlist");
  const list = document.getElementById("list");
  if (v === "") {
    list.classList.remove("invisible");
    searchlist.classList.add("invisible");
    return;
  }
  list.classList.add("invisible");
  searchlist.classList.remove("invisible");
  searchlist.innerHTML = "";
  searchlist.appendChild(searchEntry(v));
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
  return await response.json();
}
