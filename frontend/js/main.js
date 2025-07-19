function createBoughtEntry(entry) {
  const li = document.createElement("li");
  li.id = entry.ID;
  li.textContent = entry.Name;

  const divRight = document.createElement("div");
  divRight.classList.add("entryAttributes");

  const button = document.createElement("button");
  button.textContent = "Add";
  button.addEventListener("click", () => {
    fetch(`/api/v1/entries/${entry.ID}`, {
      method: "PUT",
      body: JSON.stringify({
        Name: entry.Name,
        Number: 1,
        Bought: false,
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
      .then((json) => {
        document.getElementById(json.ID)?.remove();
        const buyList = document.getElementById("buyList");
        buyList.prepend(createBuyEntry(json));
      })
      .catch((error) => {
        console.log(error);
        alert("error reaching server, best way to fix this is to reload");
      });
  });
  divRight.appendChild(button);

  li.appendChild(divRight);
  return li;
}
function createBuyEntry(entry) {
  const li = document.createElement("li");
  li.id = entry.ID;
  li.textContent = entry.Name;

  const divRight = document.createElement("div");
  divRight.classList.add("entryAttributes");

  const input = document.createElement("input");
  input.value = entry.Number;
  input.type = "text";
  divRight.appendChild(input);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("click", () => {
    fetch(`/api/v1/entries/${entry.ID}`, {
      method: "PUT",
      body: JSON.stringify({
        Name: entry.Name,
        Number: entry.Number,
        Bought: true,
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
      .then((json) => {
        document.getElementById(json.ID)?.remove();
        const boughtList = document.getElementById("boughtList");
        boughtList.prepend(createBoughtEntry(json));
      })
      .catch((error) => {
        console.log(error);
        alert("error reaching server, best way to fix this is to reload");
      });
  });
  divRight.appendChild(checkbox);

  li.appendChild(divRight);
  return li;
}

function resetFilterEntries() {
  const buyList = document.getElementById("buyList");
  const boughtList = document.getElementById("boughList");
  buyList.childNodes.forEach((li) => {
    li.classList.remove("invisible");
  });
  boughtList.childNodes.forEach((li) => {
    li.classList.remove("invisible");
  });
}

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

document.addEventListener("DOMContentLoaded", async () => {
  // render list on start
  fetch("/api/v1/entries")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`failed to sync with server, ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      const buyList = document.getElementById("buyList");
      const boughtList = document.getElementById("boughtList");
      buyList.innerHTML = "";
      boughtList.innerText = "";
      json.forEach((entry) => {
        if (entry.Bought) {
          boughtList.append(createBoughtEntry(entry));
        } else {
          buyList.append(createBuyEntry(entry));
        }
      });
    })
    .catch((error) => {
      console.log(error);
      alert("error reaching server, best way to fix this is to reload");
    });

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
    input.value = "";
    resetFilterEntries();
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`failed to sync with server, ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        const list = document.getElementById("buyList");
        list.prepend(createBuyEntry(json));
      })
      .catch((error) => {
        console.log(error);
        alert("error reaching server, best way to fix this is to reload");
      });
  });
});
