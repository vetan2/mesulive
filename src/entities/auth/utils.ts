export const getAllowedEmails = () =>
  (process.env.ALLOWED_EMAILS || "").split(",").map((email) => email.trim());
