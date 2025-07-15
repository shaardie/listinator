export function searchEntry(entry) {
  const li = document.createElement("li");

  li.textContent = entry;

  const button = document.createElement("button");
  button.textContent = "+";
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

export function createEntry(entry) {
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
