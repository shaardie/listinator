function createEntry(entry) {
  const li = document.createElement("li");

  const divLeft = document.createElement("div");
  divLeft.textContent = entry.Name;
  li.appendChild(divLeft);

  const divRight = document.createElement("div");
  divRight.classList.add("entryAttributes");

  const input = document.createElement("input");
  input.value = entry.Number;
  input.type = "text";
  divRight.appendChild(input);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  divRight.appendChild(checkbox);

  li.appendChild(divRight);
  return li;
}

function renderList(filter = "") {
  fetch("/api/v1/entries")
    .then((response) => response.json())
    .then((json) => {
      const l = document.getElementById("list");
      l.innerHTML = "";
      json.forEach((entry) => {
        if (entry.Name.toLowerCase().includes(filter.toLowerCase())) {
          l.appendChild(createEntry(entry));
        }
      });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  // render list on start
  renderList();

  // on Enter in searchInput trigger button
  document
    .getElementById("searchInput")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addButton").click();
      }
    });

  // trigger re-rendering of the list on search input changes
  document.getElementById("searchInput").addEventListener("keyup", () => {
    const v = document.getElementById("searchInput").value;
    renderList(v);
  });

  // add entry on add button push
  document.getElementById("addButton").addEventListener("click", () => {
    const input = document.getElementById("searchInput");
    const name = input.value;
    input.value = "";
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
  });
});
