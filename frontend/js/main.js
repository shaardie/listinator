function createBuyEntry(entry) {
  const li = document.createElement("li");
  li.id = entry.ID;

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
        // TODO: Add new element
        document.getElementById(json.ID)?.remove();
        const boughtList = document.getElementById("boughtList");
        boughtList.prepend(createBuyEntry(json));
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

// function renderList(filter = "") {
//   fetch("/api/v1/entries")
//     .then((response) => response.json())
//     .then((json) => {
//       const l = document.getElementById("list");
//       l.innerHTML = "";
//       json.forEach((entry) => {
//         if (entry.Name.toLowerCase().includes(filter.toLowerCase())) {
//           l.appendChild(createEntry(entry));
//         }
//       });
//     });
// }

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
          boughtList.append(createBuyEntry(entry));
        } else {
          buyList.append(createBuyEntry(entry));
        }
      });
    })
    .catch(() => {
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
  // document.getElementById("searchInput").addEventListener("keyup", () => {
  //   const v = document.getElementById("searchInput").value;
  //   renderList(v);
  // });

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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`failed to sync with server, ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        // TODO: Add new element
        console.log(json);
        const list = document.getElementById("buyList");
        list.prepend(createBuyEntry(json));
      })
      .catch((error) => {
        console.log(error);
        alert("error reaching server, best way to fix this is to reload");
      });
  });
});
