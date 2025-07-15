export async function addEntry(entry) {
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

export async function getEntries() {
  const response = await fetch("/api/v1/entries");
  // TODO: Error handling
  return await response.json();
}
