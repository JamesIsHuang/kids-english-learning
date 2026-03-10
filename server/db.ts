import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, and } from "drizzle-orm";
import * as schema from "../drizzle/schema";

let db: any = null;

export async function getDb() {
  if (db) return db;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "kids_english",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  db = drizzle(connection, { schema, mode: "default" });
  return db;
}

/**
 * 获取用户的学习进度
 */
export async function getUserLearningProgress(userId: string) {
  const database = await getDb();
  const { learningProgress } = schema;
  const progress = await database.query.learningProgress.findFirst({
    where: eq(learningProgress.userId, userId),
  });
  return progress;
}

/**
 * 更新用户的学习进度
 */
export async function updateUserLearningProgress(
  userId: string,
  data: any
) {
  const database = await getDb();
  const { learningProgress } = schema;
  
  return await database
    .update(learningProgress)
    .set(data)
    .where(eq(learningProgress.userId, userId));
}

/**
 * 获取用户的收藏夹
 */
export async function getUserFavorites(userId: string) {
  const database = await getDb();
  const { favorites } = schema;
  const favs = await database.query.favorites.findMany({
    where: eq(favorites.userId, userId),
  });
  return favs;
}

/**
 * 添加单词到收藏夹
 */
export async function addFavorite(
  userId: string,
  data: any
) {
  const database = await getDb();
  const { favorites } = schema;
  
  return await database.insert(favorites).values({
    id: `fav_${Date.now()}`,
    userId,
    ...data,
  });
}

/**
 * 从收藏夹删除单词
 */
export async function removeFavorite(userId: string, wordId: string) {
  const database = await getDb();
  const { favorites } = schema;
  
  return await database
    .delete(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.wordId, wordId)
      )
    );
}

/**
 * 获取用户的成就
 */
export async function getUserAchievements(userId: string) {
  const database = await getDb();
  const { achievements } = schema;
  
  const achs = await database.query.achievements.findMany({
    where: eq(achievements.userId, userId),
  });
  return achs;
}

/**
 * 解锁成就
 */
export async function unlockAchievement(
  userId: string,
  data: any
) {
  const database = await getDb();
  const { achievements } = schema;
  
  return await database.insert(achievements).values({
    id: `ach_${Date.now()}`,
    userId,
    ...data,
  });
}
