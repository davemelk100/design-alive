import { db } from '../db';
import { siteConfig } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface SiteConfigValue {
  [key: string]: any;
}

export interface SiteConfigItem {
  id: string;
  key: string;
  value: SiteConfigValue;
  description?: string;
  isPublic: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class SiteConfigService {
  /**
   * Get a site configuration value by key
   */
  static async getConfig(key: string): Promise<SiteConfigValue | null> {
    try {
      const result = await db
        .select()
        .from(siteConfig)
        .where(eq(siteConfig.key, key))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      return result[0].value as SiteConfigValue;
    } catch (error) {
      console.error('Error getting site config:', error);
      return null;
    }
  }

  /**
   * Set a site configuration value
   */
  static async setConfig(
    key: string,
    value: SiteConfigValue,
    description?: string,
    isPublic: boolean = false
  ): Promise<boolean> {
    try {
      const existing = await db
        .select()
        .from(siteConfig)
        .where(eq(siteConfig.key, key))
        .limit(1);

      if (existing.length > 0) {
        // Update existing config
        await db
          .update(siteConfig)
          .set({
            value,
            description,
            isPublic,
            updatedAt: new Date(),
          })
          .where(eq(siteConfig.key, key));
      } else {
        // Create new config
        await db.insert(siteConfig).values({
          key,
          value,
          description,
          isPublic,
        });
      }

      return true;
    } catch (error) {
      console.error('Error setting site config:', error);
      return false;
    }
  }

  /**
   * Get all public site configurations
   */
  static async getPublicConfigs(): Promise<SiteConfigItem[]> {
    try {
      const result = await db
        .select()
        .from(siteConfig)
        .where(eq(siteConfig.isPublic, true));

      return result.map(item => ({
        id: item.id,
        key: item.key,
        value: item.value as SiteConfigValue,
        description: item.description || undefined,
        isPublic: item.isPublic || false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    } catch (error) {
      console.error('Error getting public site configs:', error);
      return [];
    }
  }

  /**
   * Delete a site configuration
   */
  static async deleteConfig(key: string): Promise<boolean> {
    try {
      await db
        .delete(siteConfig)
        .where(eq(siteConfig.key, key));

      return true;
    } catch (error) {
      console.error('Error deleting site config:', error);
      return false;
    }
  }

  /**
   * Initialize default site configuration
   */
  static async initializeDefaultConfig(): Promise<void> {
    const defaultConfigs = [
      {
        key: 'site_title',
        value: 'davemelk news',
        description: 'Main site title',
        isPublic: true,
      },
      {
        key: 'default_theme',
        value: 'light',
        description: 'Default theme for new users',
        isPublic: true,
      },
      {
        key: 'default_view_mode',
        value: 'grid',
        description: 'Default view mode for new users',
        isPublic: true,
      },
      {
        key: 'default_category',
        value: 'all',
        description: 'Default active category for new users',
        isPublic: true,
      },
      {
        key: 'rss_feeds',
        value: [
          {
            id: 'ars-technica',
            name: 'Ars Technica',
            url: 'https://feeds.arstechnica.com/arstechnica/index',
            category: 'technology',
            enabled: true,
          },
          {
            id: 'wired',
            name: 'WIRED',
            url: 'https://www.wired.com/feed/rss',
            category: 'technology',
            enabled: true,
          },
          {
            id: 'techradar',
            name: 'TechRadar',
            url: 'https://www.techradar.com/feeds.xml',
            category: 'technology',
            enabled: true,
          },
          {
            id: 'fox-sports',
            name: 'Fox Sports',
            url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30',
            category: 'sports',
            enabled: true,
          },
          {
            id: 'lambgoat',
            name: 'Lambgoat',
            url: 'https://rss.app/feeds/rbqQqO2y53KWY7C2.xml',
            category: 'entertainment',
            enabled: true,
          },
          {
            id: 'no-echo',
            name: 'No Echo',
            url: 'https://rss.app/feeds/6VPbwVscIplNrYkC.xml',
            category: 'entertainment',
            enabled: true,
          },
          {
            id: 'newsweek',
            name: 'Newsweek',
            url: 'https://feeds.newsweek.com/feeds/90oh8.rss',
            category: 'business',
            enabled: true,
          },
          {
            id: 'new-york-post',
            name: 'New York Post',
            url: 'https://nypost.com/feed/',
            category: 'entertainment',
            enabled: true,
          },
          {
            id: 'fox-news',
            name: 'Fox News',
            url: 'https://rss.app/feeds/jmwv7HSN9sLVzyMP.xml',
            category: 'business',
            enabled: true,
          },
          {
            id: 'breitbart',
            name: 'Breitbart',
            url: 'https://rss.app/feeds/Ez9O0bz1UTzcmRJu.xml',
            category: 'politics',
            enabled: true,
          },
          {
            id: 'cnn-sports',
            name: 'CNN - SPORTS',
            url: 'https://rss.app/feeds/692Tsxos17wzrYX6.xml',
            category: 'sports',
            enabled: true,
          },
          {
            id: 'cbs-sports',
            name: 'CBS SPORTS',
            url: 'https://rss.app/feeds/3woxRS3rir9rtQFO.xml',
            category: 'sports',
            enabled: true,
          },
          {
            id: 'windows11',
            name: '#Windows11',
            url: 'https://rss.app/feeds/tMbiKRyJYYawUbRX.xml',
            category: 'technology',
            enabled: true,
          },
        ],
        description: 'Default RSS feeds configuration',
        isPublic: true,
      },
      {
        key: 'category_colors',
        value: {
          all: {
            bg: 'bg-blue-50 dark:bg-blue-900/30',
            text: 'text-blue-900 dark:text-blue-100',
            border: 'border-blue-300',
            hover: 'hover:bg-blue-100 dark:hover:bg-blue-700',
            chip: {
              bg: 'bg-blue-100 dark:bg-blue-800/50',
              text: 'text-blue-800 dark:text-blue-200',
              border: 'border-blue-300 dark:border-blue-600',
            },
          },
          technology: {
            bg: 'bg-[#fef2de] dark:bg-[#f79d84]/30',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-[#f79d84]',
            hover: 'hover:bg-[#fef2de] dark:hover:bg-[#f79d84]/20',
            chip: {
              bg: 'bg-[#fef2de] dark:bg-[#f79d84]/30',
              text: 'text-gray-800 dark:text-gray-200',
              border: 'border-[#f79d84] dark:border-[#f79d84]',
            },
          },
          sports: {
            bg: 'bg-[#def5e9] dark:bg-[#59cd90]/30',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-[#59cd90]',
            hover: 'hover:bg-[#def5e9] dark:hover:bg-[#59cd90]/20',
            chip: {
              bg: 'bg-[#def5e9] dark:bg-[#59cd90]/30',
              text: 'text-gray-800 dark:text-gray-200',
              border: 'border-[#59cd90] dark:border-[#59cd90]',
            },
          },
          business: {
            bg: 'bg-[#d8edf7] dark:bg-[#3fa7d6]/30',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-[#3fa7d6]',
            hover: 'hover:bg-[#d8edf7] dark:hover:bg-[#3fa7d6]/20',
            chip: {
              bg: 'bg-[#d8edf7] dark:bg-[#3fa7d6]/30',
              text: 'text-gray-800 dark:text-gray-200',
              border: 'border-[#3fa7d6] dark:border-[#3fa7d6]',
            },
          },
          entertainment: {
            bg: 'bg-[#f3e8ff] dark:bg-[#a855f7]/30',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-[#a855f7]',
            hover: 'hover:bg-[#f3e8ff] dark:hover:bg-[#a855f7]/20',
            chip: {
              bg: 'bg-[#f3e8ff] dark:bg-[#a855f7]/30',
              text: 'text-gray-800 dark:text-gray-200',
              border: 'border-[#a855f7] dark:border-[#a855f7]',
            },
          },
          politics: {
            bg: 'bg-[#fdebe6] dark:bg-[#f97316]/30',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-[#f97316]',
            hover: 'hover:bg-[#fdebe6] dark:hover:bg-[#f97316]/20',
            chip: {
              bg: 'bg-[#fdebe6] dark:bg-[#f97316]/30',
              text: 'text-gray-800 dark:text-gray-200',
              border: 'border-[#f97316] dark:border-[#f97316]',
            },
          },
          custom: {
            bg: 'bg-[#fdebe6] dark:bg-[#ef4444]/30',
            text: 'text-gray-800 dark:text-gray-200',
            border: 'border-[#ef4444]',
            hover: 'hover:bg-[#fdebe6] dark:hover:bg-[#ef4444]/20',
            chip: {
              bg: 'bg-[#fdebe6] dark:bg-[#ef4444]/30',
              text: 'text-gray-800 dark:text-gray-200',
              border: 'border-[#ef4444] dark:border-[#ef4444]',
            },
          },
        },
        description: 'Category color scheme configuration',
        isPublic: true,
      },
    ];

    for (const config of defaultConfigs) {
      await this.setConfig(config.key, config.value as SiteConfigValue, config.description, config.isPublic);
    }
  }
}
