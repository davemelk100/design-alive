import { db } from "../db";
import { users, userSettings, magicLinks } from "../db/schema";
import { generateToken, generateMagicLinkToken } from "../lib/auth";
import { EmailService } from "./emailService";
import { eq, and, gt, lt } from "drizzle-orm";

export interface CreateUserData {
  email: string;
  name?: string;
}

export interface MagicLinkData {
  email: string;
}

export class UserService {
  static async createUser(data: CreateUserData) {
    try {
      const [user] = await db
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
          emailVerified: true, // Since they're using magic link
        })
        .returning();

      // Create default settings for the user
      await db.insert(userSettings).values({
        userId: user.id,
        theme: "light",
        viewMode: "grid",
        activeCategory: "all",
        customFeeds: [],
        preferences: {},
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      return { user, token };
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  static async sendMagicLink(data: MagicLinkData, baseUrl: string) {
    try {
      // Check if user exists, create if not
      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email));

      if (!user) {
        // Create new user
        const result = await this.createUser({ email: data.email });
        user = result.user;
      }

      // Clean up old magic links for this email
      await db.delete(magicLinks).where(eq(magicLinks.email, data.email));

      // Generate new magic link
      const token = generateMagicLinkToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await db.insert(magicLinks).values({
        email: data.email,
        token,
        expiresAt,
      });

      // Send magic link email
      const emailSent = await EmailService.sendMagicLink(
        data.email,
        token,
        baseUrl
      );

      if (!emailSent) {
        throw new Error("Failed to send magic link email");
      }

      return { success: true, message: "Magic link sent to your email" };
    } catch (error) {
      throw new Error("Failed to send magic link");
    }
  }

  static async verifyMagicLink(email: string, token: string) {
    try {
      // Find the magic link
      const [magicLink] = await db
        .select()
        .from(magicLinks)
        .where(
          and(
            eq(magicLinks.email, email),
            eq(magicLinks.token, token),
            eq(magicLinks.used, false),
            gt(magicLinks.expiresAt, new Date())
          )
        );

      if (!magicLink) {
        throw new Error("Invalid or expired magic link");
      }

      // Mark magic link as used
      await db
        .update(magicLinks)
        .set({ used: true })
        .where(eq(magicLinks.id, magicLink.id));

      // Get or create user
      let [user] = await db.select().from(users).where(eq(users.email, email));

      if (!user) {
        throw new Error("User not found");
      }

      // Mark email as verified
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, user.id));

      // Generate JWT token
      const jwtToken = generateToken({
        userId: user.id,
        email: user.email,
      });

      return { user, token: jwtToken };
    } catch (error) {
      throw new Error("Failed to verify magic link");
    }
  }

  static async getUserById(userId: string) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));

      return user;
    } catch (error) {
      throw new Error("Failed to get user");
    }
  }

  static async getUserSettings(userId: string) {
    try {
      const [settings] = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, userId));

      return settings;
    } catch (error) {
      throw new Error("Failed to get user settings");
    }
  }

  static async updateUserSettings(
    userId: string,
    updates: Partial<typeof userSettings.$inferInsert>
  ) {
    try {
      const [updatedSettings] = await db
        .update(userSettings)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, userId))
        .returning();

      return updatedSettings;
    } catch (error) {
      throw new Error("Failed to update user settings");
    }
  }

  static async cleanupExpiredMagicLinks() {
    try {
      await db.delete(magicLinks).where(lt(magicLinks.expiresAt, new Date()));

      return { success: true, message: "Expired magic links cleaned up" };
    } catch (error) {
      throw new Error("Failed to cleanup expired magic links");
    }
  }
}
