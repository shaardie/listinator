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

/**
 * Cache for types to avoid frequent API calls.
 */
const typeCache = {
  ttl: 60000, // 1min in milliseconds
  timestamp: 0,
  data: null,
};

/**
 * getTypes fetches the types from the API and caches them.
 * @returns {Promise<Array>} - A promise that resolves to the array of types.
 */
async function getTypes() {
  const now = Date.now();
  if (now - typeCache.timestamp < typeCache.ttl && typeCache.data != null) {
    return typeCache.data;
  }
  try {
    typeCache.data = await apiFetch("/api/v1/types");
    typeCache.timestamp = now;
    return typeCache.data;
  } catch (error) {
    showError(error);
  }
  return [];
}

document.addEventListener("DOMContentLoaded", async () => {
  // Dom Element
  const buyList = document.getElementById("buyList");
  const boughtList = document.getElementById("boughtList");
  const searchInput = document.getElementById("searchInput");
  const addButton = document.getElementById("addButton");

  /**
   * createTypeSelect creates a select element with options for each type.
   * @param {HTMLSelectElement} select - The select element to populate with options.
   * @param {string} selected - The type that should be selected by default.
   * @returns {Promise<void>} - A promise that resolves when the select is populated.
   */
  async function createTypeSelect(select, selected) {
    const types = await getTypes();
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.Name;
      option.textContent = type.Icon;
      if (selected === type.Name) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  }

  /**
   * updateEntryInDOM updates the entry in the DOM.
   * @param {Object} entry - The entry object to update.
   */
  async function updateEntryInDOM(entry) {
    document.getElementById(entry.ID)?.remove();
    const li = await createEntry(entry);
    if (entry.Bought) {
      boughtList.prepend(li);
    } else {
      buyList
        .querySelector(`div[data-type-id="${entry.TypeID || "unknown"}"]`)
        .after(li);
    }
  }

  /**
   * updateEntry updates an entry on the server.
   * @param {Object} entry - The entry object to update.
   * @returns {Promise<void>} - A promise that resolves when the entry is updated.
   */
  async function updateEntry(entry) {
    try {
      const json = await apiFetch(`/api/v1/entries/${entry.ID}`, {
        method: "PUT",
        body: JSON.stringify({
          Name: entry.Name,
          Number: entry.Number,
          Bought: entry.Bought,
          TypeID: entry.TypeID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await updateEntryInDOM(json);
    } catch (error) {
      showError(error);
    }
  }

  /**
   * createContextmenuHanlder creates a context menu handler for an entry.
   * @param {HTMLLIElement} li - The list item element that the context menu
   * @param {Object} entry - The entry object to create a context menu for.
   * @returns {Function} - A function that handles the context menu event.
   */
  function createContextmenuHandler(li, entry) {
    return function (event) {
      event.preventDefault();

      // Delete existing context menu if it exists
      document.getElementById("contextmenu")?.remove();

      // Create a new context menu
      const menu = document.createElement("div");
      menu.id = "contextmenu";
      menu.classList.add("context-menu");
      menu.style.top = event.pageY + "px";
      menu.style.left = event.pageX + "px";

      // Delete Button
      const deleteButton = document.createElement("div");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        try {
          await apiFetch(`/api/v1/entries/${entry.ID}`, { method: "DELETE" });
          document.getElementById(entry.ID)?.remove();
          menu.remove();
        } catch (error) {
          showError(error);
        }
      });
      menu.appendChild(deleteButton);

      // Add context menu to the body
      li.appendChild(menu);

      const handleClickOutside = async (event) => {
        if (!menu.contains(event.target)) {
          menu.remove();
          document.removeEventListener("click", handleClickOutside);
        }
      };
      // Close context menu when clicking outside
      document.addEventListener("click", handleClickOutside);
    };
  }

  /**
   * createEntry creates a list item for an entry.
   * @param {Object} entry - The entry object to create a list item for.
   * @returns {HTMLLIElement} - The created list item element.
   */
  async function createEntry(entry) {
    const li = document.createElement("li");
    li.id = entry.ID;

    // Set context menu handler
    li.addEventListener("contextmenu", createContextmenuHandler(li, entry));

    // Left side: Type and Name
    const divLeft = document.createElement("div");
    divLeft.classList.add("entryAttributes");
    li.appendChild(divLeft);
    const select = document.createElement("select");
    await createTypeSelect(select, entry.TypeID);
    select.addEventListener("change", () => {
      updateEntry({
        ID: entry.ID,
        Name: entry.Name,
        Number: entry.Number,
        Bought: entry.Bought,
        TypeID: select.value,
      });
    });
    divLeft.appendChild(select);
    const divName = document.createElement("div");
    divName.textContent = entry.Name;
    divLeft.appendChild(divName);

    // Right side: Number input and Bought checkbox
    const divRight = document.createElement("div");
    divRight.classList.add("entryAttributes");
    if (entry.Bought === true) {
      // Bought entry
      const button = document.createElement("button");
      button.textContent = "+";
      button.addEventListener("click", () =>
        updateEntry({
          ID: entry.ID,
          Name: entry.Name,
          Bought: false,
          Number: entry.Number,
          TypeID: entry.TypeID,
        }),
      );
      divRight.appendChild(button);
    } else {
      // Buy entry
      const input = document.createElement("input");
      input.value = entry.Number;
      input.type = "text";
      input.addEventListener("change", (event) => {
        const input = event.currentTarget;
        const number = input.value;
        if (entry.Number === number) {
          return;
        }
        updateEntry({
          ID: entry.ID,
          Name: entry.Name,
          Bought: entry.Bought,
          Number: number,
          TypeID: entry.TypeID,
        });
      });
      divRight.appendChild(input);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("click", () =>
        updateEntry({
          ID: entry.ID,
          Name: entry.Name,
          Bought: true,
          Number: entry.Number,
          TypeID: entry.TypeID,
        }),
      );
      divRight.appendChild(checkbox);
    }
    li.appendChild(divRight);
    return li;
  }

  /**
   * resetFilterEntries resets the visibility of all entries in the buy and bought lists.
   * It makes all entries visible again.
   * This is useful when the user clears the search input.
   * @returns {void}
   */
  function resetFilterEntries() {
    [buyList, boughtList].forEach((list) => {
      list.querySelectorAll("li").forEach((li) => {
        li.classList.remove("invisible");
      });
    });
  }

  /**
   * filterEntries filters the entries in the buy and bought lists based on the search input.
   * It hides entries that do not match the search input.
   * @returns {void}
   */
  function filterEntries() {
    const filter = searchInput.value.toLowerCase();
    [buyList, boughtList].forEach((list) => {
      list.querySelectorAll("li").forEach((li) => {
        li.textContent.toLowerCase().includes(filter)
          ? li.classList.remove("invisible")
          : li.classList.add("invisible");
      });
    });
  }

  /**
   * addButtonClick handles the click event on the add button.
   * It retrieves the value from the search input, ignores empty input,
   * and sends a POST request to add a new entry.
   */
  async function addButtonClick() {
    const name = searchInput.value;
    // ignore empty input
    if (name === "") {
      return;
    }
    searchInput.value = "";
    resetFilterEntries();
    try {
      const json = await apiFetch("/api/v1/entries", {
        method: "POST",
        body: JSON.stringify({
          Name: name,
          Number: "",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await updateEntryInDOM(json);
    } catch (error) {
      showError(error);
    }
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

  // Add fake entries to the buyList
  const types = await getTypes();
  types.forEach((element) => {
    const div = document.createElement("div");
    div.dataset.typeId = element.Name;
    div.classList.add("invisible");
    buyList.appendChild(div);
  });

  // Get entries from server on start
  try {
    const json = await apiFetch("/api/v1/entries");
    for (const key in json) {
      await updateEntryInDOM(json[key]);
    }
  } catch (error) {
    showError(error);
  }
});
