// updateEntryinDOM removes a potential existing entry and creates a new one in the DOM
function updateEntryInDOM(entry) {
  const li = createEntry(entry);
  const list = entry.Bought
    ? document.getElementById("boughtList")
    : document.getElementById("buyList");
  document.getElementById(entry.ID)?.remove();
  list.prepend(li);
}

// updateEntry updates an entry on the backend and trigger an update in the DOM
function updateEntry(entry) {
  fetch(`/api/v1/entries/${entry.ID}`, {
    method: "PUT",
    body: JSON.stringify({
      Name: entry.Name,
      Number: entry.Number,
      Bought: entry.Bought,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`failed to sync with server, ${response.status}`);
      }
      return response.json();
    })
    .then((json) => updateEntryInDOM(json))
    .catch((error) => {
      console.log(error);
      alert("error reaching server, best way to fix this is to reload");
    });
}

// createEntry creates a new li element with the entry in it
function createEntry(entry) {
  const li = document.createElement("li");
  li.id = entry.ID;
  li.textContent = entry.Name;

  const div = document.createElement("div");
  div.classList.add("entryAttributes");

  if (entry.Bought === true) {
    // Bought entry
    const button = document.createElement("button");
    button.textContent = "+";
    button.addEventListener("click", () =>
      updateEntry({
        ID: entry.ID,
        Name: entry.Name,
        Bought: false,
        Number: "",
      }),
    );
    div.appendChild(button);
  } else {
    // Buy entry
    const input = document.createElement("input");
    input.value = entry.Number;
    input.type = "text";
    input.classList.add("liInput");
    input.addEventListener("change", (event) => {
      const li = event.currentTarget;
      const number = li.value;
      if (entry.Number === number) {
        return;
      }
      updateEntry({
        ID: entry.ID,
        Name: entry.Name,
        Bought: entry.Bought,
        Number: number,
      });
    });
    div.appendChild(input);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("click", () =>
      updateEntry({
        ID: entry.ID,
        Name: entry.Name,
        Bought: true,
        Number: "",
      }),
    );
    div.appendChild(checkbox);
  }
  li.appendChild(div);
  return li;
}

// resetFilterEntries reset filtering the entries in the DOM
function resetFilterEntries() {
  const buyList = document.getElementById("buyList");
  const boughtList = document.getElementById("boughtList");
  buyList.childNodes.forEach((li) => {
    li.classList.remove("invisible");
  });
  boughtList.childNodes.forEach((li) => {
    li.classList.remove("invisible");
  });
}

// filterEntries filters the entries in the DOM
function filterEntries(filter) {
  filter = filter.toLowerCase();
  const buyList = document.getElementById("buyList");
  const boughtList = document.getElementById("boughtList");
  buyList.childNodes.forEach((li) => {
    if (li.textContent.toLowerCase().includes(filter)) {
      li.classList.remove("invisible");
    } else {
      li.classList.add("invisible");
    }
  });
  boughtList.childNodes.forEach((li) => {
    if (li.textContent.toLowerCase().includes(filter)) {
      li.classList.remove("invisible");
    } else {
      li.classList.add("invisible");
    }
  });
}

// userInput checks if the user is currently trying to change something.
// This is probably pretty fragile.
function userInput() {
  // Check, if the user is searching for something.
  if (document.getElementById("searchInput")?.value != "") {
    return true;
  }

  // Check, if the user has currently the input of an entry selected.
  if (document.activeElement?.classList.contains("liInput")) {
    return true;
  }
  return false;
}

// updateEntriesFromServer fetches the entries from the server and updates the lists.
// If there is currently a user action, it does nothing
function updateEntriesFromServer() {
  // do not update on user input (fail early)
  if (userInput()) {
    return;
  }
  fetch("/api/v1/entries")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`failed to sync with server, ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      // do not update on user input (fail late)
      if (userInput()) {
        return;
      }
      json.forEach((entry) => updateEntryInDOM(entry));
    })
    .catch((error) => {
      console.log(error);
      alert("error reaching server, best way to fix this is to reload");
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Get entries from server on start
  updateEntriesFromServer();

  // Update entries every 5s
  setInterval(updateEntriesFromServer, 5000);

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
    filterEntries(document.getElementById("searchInput")?.value);
  });

  // add entry on add button push
  document.getElementById("addButton").addEventListener("click", () => {
    const input = document.getElementById("searchInput");
    const name = input.value;
    // ignore empty input
    if (name === "") {
      return;
    }
    input.value = "";
    resetFilterEntries();
    fetch("/api/v1/entries", {
      method: "POST",
      body: JSON.stringify({
        Name: name,
        Number: "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`failed to sync with server, ${response.status}`);
        }
        return response.json();
      })
      .then((json) => updateEntryInDOM(json))
      .catch((error) => {
        console.log(error);
        alert("error reaching server, best way to fix this is to reload");
      });
  });
});
