import { logger } from "@captable/logger";

import { db } from "../index";
import { companies, users } from "../schema";
import seedCompanies from "./companies";
import seedTeam from "./team";

// Prevent running in production
if (process.env.NODE_ENV === "production") {
  logger.error("❌ Cannot run seed script in production environment");
  process.exit(1);
}

const seed = () => {
  try {
    logger.info("Seeding database");
    return db.transaction(async (_tx) => {
      await seedCompanies();
      await seedTeam();
    });
  } catch (error) {
    logger.error("Error seeding database", error);
    throw error;
  }
};

const _nuke = () => {
  logger.info("🚀 Nuking database records");
  return db.transaction(async (_tx) => {
    // Delete all records in reverse order of dependencies
    await db.delete(users);
    await db.delete(companies);
    // Add other tables that need to be cleared
  });
};

// Execute the seed function
seed()
  .then(() => {
    logger.info("✅ Database seeding completed");
    logger.info(`💌 We have created four admin accounts for you. Please login with one of these emails:
      ceo@example.com
      cto@example.com
      cfo@example.com
      lawyer@example.com`);
  })
  .catch((error: Error) => {
    logger.error(`❌ ${error.message}`);
  });
