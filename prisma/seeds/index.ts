import { db } from "@/server/db";
import colors from "colors";
import inquirer from "inquirer";
colors.enable();

import { Prisma } from "@prisma/client";
import type { QuestionCollection } from "inquirer";
import seedCompanies from "./companies";
import { seedStakeholders } from "./stakeholder";
import seedTeam from "./team";

if (process.env.NODE_ENV === "production") {
  console.log("❌ You cannot run this command on production".red);
  process.exit(0);
}

const seed = async () => {
  const inquiry = await inquirer.prompt({
    type: "confirm",
    name: "answer",
    message: "Are you sure you want to NUKE 🚀 and re-seed the database?",
  } as QuestionCollection);

  // const answer = true;
  const answer = inquiry.answer as boolean;

  if (answer) {
    await cleanupDb();

    console.log("Seeding database".underline.cyan);
    return db.$transaction(async (tx) => {
      const companies = await seedCompanies(tx);
      await seedTeam(tx);

      for (const company of companies) {
        await seedStakeholders(tx, company.id, company.name, 500);
      }
    });
  }
  throw new Error("Seeding aborted");
};

await seed()
  .then(() => {
    console.log("✅ Database seeding completed".green);
    console.log(
      "💌 We have created four admin accounts for you. Please login with one of these emails:\n"
        .cyan,
      "ceo@example.com\n".underline.yellow,
      "cto@example.com\n".underline.yellow,
      "cfo@example.com\n".underline.yellow,
      "lawyer@example.com\n".underline.yellow,
    );
  })
  .catch((error: Error) => {
    console.log(`❌ ${error.message}`.red);
  })
  .finally(async () => {
    await db.$disconnect();
  });

export async function cleanupDb() {
  console.log("🚀 Nuking database records".yellow);

  try {
    const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' AND tablename != '_prisma_migrations'
  `;

    // Disable foreign key checks
    await db.$executeRaw`SET CONSTRAINTS ALL DEFERRED`;

    for (const { tablename } of tables) {
      try {
        // Check if the table exists before attempting to truncate
        const tableExists = await db.$queryRaw<[{ exists: boolean }]>`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = ${tablename}
          )
        `;

        if (tableExists[0].exists) {
          await db.$executeRaw(
            Prisma.sql`TRUNCATE TABLE "${Prisma.raw(tablename)}" CASCADE`,
          );
          console.log(`Table ${tablename} truncated successfully`.green);
        } else {
          console.log(`Table ${tablename} doesn't exist, skipping`.yellow);
        }
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(`Error truncating table ${tablename}:`, err.message);
        } else {
          console.error(`Unexpected error truncating table ${tablename}:`, err);
        }
      }
    }

    // Re-enable foreign key checks
    await db.$executeRaw`SET CONSTRAINTS ALL IMMEDIATE`;

    console.log(
      "All tables reset successfully, except _prisma_migrations".yellow,
    );
  } catch (error) {
    console.error("Error resetting tables:", error);
  }
}
