import { db } from "@/server/db";
import colors from "colors";
colors.enable();

import seedCompanies from "./companies";
import seedTeam from "./team";

if (process.env.NODE_ENV === "production") {
  console.log("❌ You cannot run this command on production".red);
  process.exit(0);
}

const nuke = async () => {
  console.log("🚀 Nuking database records".yellow);
  return db.$transaction(async (db) => {
    await db.user.deleteMany();
    await db.member.deleteMany();
    await db.company.deleteMany();
    await db.shareClass.deleteMany();
    await db.equityPlan.deleteMany();
    await db.document.deleteMany();
    await db.audit.deleteMany();
    await db.session.deleteMany();
  });
};

const checkExistingRecords = async () => {
  const userCount = await db.user.findMany();
  console.log(
    `${userCount?.length} user(s) are currently present in User table.`.yellow,
  );
  return userCount?.length > 0;
};

const seed = async () => {
  // Check if there are existing records in the database
  const hasExistingRecords = await checkExistingRecords();

  if (hasExistingRecords) {
    throw new Error("Database is already seeded. Skipping seeding process.");
  }

  await nuke();

  console.log("Seeding database".underline.cyan);
  return db.$transaction(async () => {
    await seedCompanies();
    await seedTeam();
  });
};

await seed()
  .then(async () => {
    console.log("✅ Database seeding completed".green);
    console.log(
      `💌 We have created four admin accounts for you. Please login with one of these emails:\n`
        .cyan,
      `ceo@example.com\n`.underline.yellow,
      `cto@example.com\n`.underline.yellow,
      `cfo@example.com\n`.underline.yellow,
      `lawyer@example.com\n`.underline.yellow,
    );
    await db.$disconnect();
  })
  .catch(async (error: Error) => {
    console.log(` ❌ - ${error.message}`.yellow);
    await db.$disconnect();
  });
