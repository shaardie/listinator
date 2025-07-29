/**
 * Logs an error and shows a generic alert to the user.
 * @param {Error|any} error - error to log
 */
export function showError(
  error,
  userMessage = "error reaching server, best way to fix this is probably to reload",
) {
  console.log(error);
  alert(userMessage);
}
