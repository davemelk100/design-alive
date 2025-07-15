// Simple SHA-256 hash function for password verification
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const verifyPassword = async (password: string): Promise<boolean> => {
  const hashedPassword = await hashPassword(password);
  const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

  if (!expectedHash) {
    console.error("VITE_ADMIN_PASSWORD_HASH environment variable is not set");
    return false;
  }

  return hashedPassword === expectedHash;
};
