import { faker } from "@faker-js/faker";
import { db } from "@/server/db";
import colors from "colors";
colors.enable();

type UserType = {
  name: string;
  email: string;
  image?: string;
};

const seedStakeholders = async (count = 25) => {
  const stakeholders: UserType[] = [];

  for (let i = 0; i < count; i++) {
    stakeholders.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
    });
  }

  console.log(`Seeding ${stakeholders.length} stakeholders`.blue);

  const records = await db.user.createMany({
    data: stakeholders,
  });

  console.log(`🎉 Seeded ${records.count} stakeholders`.green);
  return records;
};

export default seedStakeholders;
