import { apiFetch } from "./api/api.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  // Dom Elements
  const newListButton = document.getElementById("newListButton");
  newListButton.addEventListener("click", async () => {
    const json = await apiFetch("api/v1/lists", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // redirect to the new list page
    window.location.href = `/list.html?ListID=${encodeURIComponent(json.ID)}`;
  });
});
