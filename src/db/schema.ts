import { pgTable, text, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for passwordless authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Magic link tokens for authentication
export const magicLinks = pgTable('magic_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// User settings table
export const userSettings = pgTable('user_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  theme: text('theme').default('light'),
  viewMode: text('view_mode').default('grid'),
  activeCategory: text('active_category').default('all'),
  customFeeds: jsonb('custom_feeds').default([]),
  preferences: jsonb('preferences').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// RSS feeds table
export const rssFeeds = pgTable('rss_feeds', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  category: text('category').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// News items cache table
export const newsItems = pgTable('news_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  feedId: uuid('feed_id').references(() => rssFeeds.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  excerpt: text('excerpt'),
  image: text('image'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Site configuration table for global settings
export const siteConfig = pgTable('site_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  settings: many(userSettings),
  feeds: many(rssFeeds),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const rssFeedsRelations = relations(rssFeeds, ({ one, many }) => ({
  user: one(users, {
    fields: [rssFeeds.userId],
    references: [users.id],
  }),
  newsItems: many(newsItems),
}));

export const newsItemsRelations = relations(newsItems, ({ one }) => ({
  feed: one(rssFeeds, {
    fields: [newsItems.feedId],
    references: [rssFeeds.id],
  }),
}));
