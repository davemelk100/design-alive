// Migration utility to transition from old localStorage format to new storage system

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
    // No old keys to migrate - authentication system removed
  } catch (error) {
    result.errors.push(`Migration failed: ${error}`);
    result.success = false;
  }
  return result;
};

// Check if migration is needed
export const needsMigration = (): boolean => {
  // No migration needed - authentication system removed
  return false;
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
