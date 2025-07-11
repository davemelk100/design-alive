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
  // Use environment variable if available, otherwise use hardcoded hash for production
  const expectedHash =
    import.meta.env.VITE_ADMIN_PASSWORD_HASH ||
    "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";
  return hashedPassword === expectedHash;
}; 
