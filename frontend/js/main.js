/**
 * Logs an error and show an generic alert to the user.
 * @param {Error|any} error - error to log
 */
function showError(error) {
  console.log(error);
  alert("error reaching server, best way to fix this is probably to reload");
}

/**
 * Fetches data from the API and returns the JSON response.
 * @param {string} url - The URL to fetch data from.
 * @param {Object} [options={}] - Optional fetch options.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response.
 */
async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error, ${response.status}`);
  }
  return response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  // Dom Element
  const buyList = document.getElementById("buyList");
  const boughtList = document.getElementById("boughtList");
  const searchInput = document.getElementById("searchInput");
  const addButton = document.getElementById("addButton");

  /**
   * updateEntryInDOM updates the entry in the DOM.
   * @param {Object} entry - The entry object to update.
   */
  function updateEntryInDOM(entry) {
    const li = createEntry(entry);
    const list = entry.Bought ? boughtList : buyList;
    document.getElementById(entry.ID)?.remove();
    list.prepend(li);
  }

  /**
   * updateEntry updates an entry on the server.
   * @param {Object} entry - The entry object to update.
   * @returns {Promise<void>} - A promise that resolves when the entry is updated.
   */
  function updateEntry(entry) {
    apiFetch(`/api/v1/entries/${entry.ID}`, {
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
      .then((json) => updateEntryInDOM(json))
      .catch((error) => showError(error));
  }

  /**
   * createEntry creates a list item for an entry.
   * @param {Object} entry - The entry object to create a list item for.
   * @returns {HTMLLIElement} - The created list item element.
   */
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

  /**
   * resetFilterEntries resets the visibility of all entries in the buy and bought lists.
   * It makes all entries visible again.
   * This is useful when the user clears the search input.
   * @returns {void}
   */
  function resetFilterEntries() {
    buyList.childNodes.forEach((li) => {
      li.classList.remove("invisible");
    });
    boughtList.childNodes.forEach((li) => {
      li.classList.remove("invisible");
    });
  }

  /**
   * filterEntries filters the entries in the buy and bought lists based on the search input.
   * It hides entries that do not match the search input.
   * @returns {void}
   */
  function filterEntries() {
    const filter = searchInput.value.toLowerCase();
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

  /**
   * addButtonClick handles the click event on the add button.
   * It retrieves the value from the search input, ignores empty input,
   * and sends a POST request to add a new entry.
   */
  function addButtonClick() {
    const name = searchInput.value;
    // ignore empty input
    if (name === "") {
      return;
    }
    searchInput.value = "";
    resetFilterEntries();
    apiFetch("/api/v1/entries", {
      method: "POST",
      body: JSON.stringify({
        Name: name,
        Number: "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((json) => updateEntryInDOM(json))
      .catch((error) => showError(error));
  }

  /**
   * searchInputKeydown handles the keydown event on the search input and trigger a click on the add button.
   * This allows the user to add an entry by pressing the Enter key.
   * @param {KeyboardEvent} event - The keydown event on the search input.
   * @returns {void}
   */
  function searchInputKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addButton.click();
    }
  }

  // on Enter in searchInput trigger button
  searchInput.addEventListener("keydown", searchInputKeydown);
  // trigger re-rendering of the list on search input changes
  searchInput.addEventListener("keyup", filterEntries);
  // add entry on add button push
  addButton.addEventListener("click", addButtonClick);

  // Get entries from server on start
  apiFetch("/api/v1/entries")
    .then((json) => {
      json.forEach((entry) => updateEntryInDOM(entry));
    })
    .catch((error) => showError(error));
});
