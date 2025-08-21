// Migration utility to transition from old localStorage format to new storage system
import { storage, STORAGE_KEYS } from "./storage";

interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
}

export const migrateOldStorage = (): MigrationResult => {
  const result: MigrationResult = {
    success: true,
    migratedKeys: [],
    errors: [],
  };

  try {
    // Check for old localStorage keys and migrate them
    const oldKeys = [
      "adminAuthenticated",
      "adminAuthTime",
    ];

    oldKeys.forEach((oldKey) => {
      try {
        const oldValue = localStorage.getItem(oldKey);

        if (oldValue) {
          let parsedValue;
          try {
            parsedValue = JSON.parse(oldValue);
          } catch {
            // If it's not JSON, store as string
            parsedValue = oldValue;
          }

          // Map old keys to new storage keys
          let newKey = oldKey;
          if (oldKey === "writingGalleryPieces") {
            newKey = STORAGE_KEYS.WRITING_GALLERY_PIECES;
          } else if (
            oldKey === "adminAuthenticated" ||
            oldKey === "adminAuthTime"
          ) {
            // Handle admin session migration
            if (oldKey === "adminAuthenticated") {
              const authTime = localStorage.getItem("adminAuthTime");
              if (authTime) {
                const session = {
                  isAuthenticated: oldValue === "true",
                  authTime: authTime,
                };
                storage.set(STORAGE_KEYS.ADMIN_SESSION, session);
                result.migratedKeys.push("adminSession");
              }
            }
            return; // Skip individual admin keys as we handle them together
          }

          // Store in new storage system
          storage.set(newKey, parsedValue);
          result.migratedKeys.push(newKey);

          // Remove old key after successful migration
          localStorage.removeItem(oldKey);
        }
      } catch (error) {
        result.errors.push(`Failed to migrate ${oldKey}: ${error}`);
        result.success = false;
      }
    });

    // Special handling for admin session
    const adminAuth = localStorage.getItem("adminAuthenticated");
    const adminTime = localStorage.getItem("adminAuthTime");
    if (
      adminAuth &&
      adminTime &&
      !result.migratedKeys.includes("adminSession")
    ) {
      try {
        const session = {
          isAuthenticated: adminAuth === "true",
          authTime: adminTime,
        };
        storage.set(STORAGE_KEYS.ADMIN_SESSION, session);
        result.migratedKeys.push("adminSession");
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminAuthTime");
      } catch (error) {
        result.errors.push(`Failed to migrate admin session: ${error}`);
        result.success = false;
      }
    }
  } catch (error) {
    result.errors.push(`Migration failed: ${error}`);
    result.success = false;
  }
  return result;
};

// Check if migration is needed
export const needsMigration = (): boolean => {
  const oldKeys = [
    "adminAuthenticated",
    "adminAuthTime",
  ];
  const hasOldData = oldKeys.some((key) => localStorage.getItem(key) !== null);
  return hasOldData;
};

// Force migration function for manual use
export const forceMigration = (): MigrationResult => {
  return migrateOldStorage();
};

// Auto-migrate on import
if (typeof window !== "undefined") {
  if (needsMigration()) {
    migrateOldStorage();
  }
}
