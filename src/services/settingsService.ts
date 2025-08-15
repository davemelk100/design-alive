import { db } from '../db';
import { userSettings, users } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface UserSettings {
  theme: 'light' | 'dark';
  viewMode: 'grid' | 'list';
  activeCategory: string;
  customFeeds: any[];
  preferences: Record<string, any>;
}

export class SettingsService {
  // Get or create user settings
  static async getUserSettings(email: string): Promise<UserSettings> {
    try {
      // First, get the user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      // Get their settings
      const [settings] = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, user.id));

      if (!settings) {
        // Create default settings if none exist
        const [newSettings] = await db.insert(userSettings).values({
          userId: user.id,
          theme: 'light',
          viewMode: 'grid',
          activeCategory: 'all',
          customFeeds: [],
          preferences: {},
        }).returning();

        return {
          theme: newSettings.theme as 'light' | 'dark',
          viewMode: newSettings.viewMode as 'grid' | 'list',
          activeCategory: newSettings.activeCategory || 'all',
          customFeeds: newSettings.customFeeds as any[] || [],
          preferences: newSettings.preferences as Record<string, any> || {},
        };
      }

      return {
        theme: settings.theme as 'light' | 'dark',
        viewMode: settings.viewMode as 'grid' | 'list',
        activeCategory: settings.activeCategory || 'all',
        customFeeds: settings.customFeeds as any[] || [],
        preferences: settings.preferences as Record<string, any> || {},
      };
    } catch (error) {
      throw new Error('Failed to get user settings');
    }
  }

  // Update user settings
  static async updateUserSettings(email: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    try {
      // Get the user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      // Update their settings
      const [updatedSettings] = await db
        .update(userSettings)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, user.id))
        .returning();

      return {
        theme: updatedSettings.theme as 'light' | 'dark',
        viewMode: updatedSettings.viewMode as 'grid' | 'list',
        activeCategory: updatedSettings.activeCategory || 'all',
        customFeeds: updatedSettings.customFeeds as any[] || [],
        preferences: updatedSettings.preferences as Record<string, any> || {},
      };
    } catch (error) {
      throw new Error('Failed to update user settings');
    }
  }

  // Save RSS feed preferences
  static async saveCustomFeeds(email: string, feeds: any[]): Promise<void> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      await db
        .update(userSettings)
        .set({
          customFeeds: feeds,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, user.id));
    } catch (error) {
      throw new Error('Failed to save custom feeds');
    }
  }

  // Save theme preference
  static async saveTheme(email: string, theme: 'light' | 'dark'): Promise<void> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      await db
        .update(userSettings)
        .set({
          theme,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, user.id));
    } catch (error) {
      throw new Error('Failed to save theme');
    }
  }

  // Save view mode preference
  static async saveViewMode(email: string, viewMode: 'grid' | 'list'): Promise<void> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      await db
        .update(userSettings)
        .set({
          viewMode,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, user.id));
    } catch (error) {
      throw new Error('Failed to save view mode');
    }
  }

  // Save active category
  static async saveActiveCategory(email: string, category: string): Promise<void> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new Error('User not found');
      }

      await db
        .update(userSettings)
        .set({
          activeCategory: category,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, user.id));
    } catch (error) {
      throw new Error('Failed to save active category');
    }
  }
}
