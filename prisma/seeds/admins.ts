import { faker } from "@faker-js/faker";
import { db } from "@/server/db";
import colors from "colors";
colors.enable();

type UserType = {
  name: string;
  email: string;
  image?: string;
};

const seedAdmins = async () => {
  const admins: UserType[] = [
    {
      name: faker.person.fullName(),
      email: "ceo@example.com",
      image: faker.image.avatar(),
    },

    {
      name: faker.person.fullName(),
      email: "cto@example.com",
      image: faker.image.avatar(),
    },

    {
      name: faker.person.fullName(),
      email: "cfo@example.com",
      image: faker.image.avatar(),
    },

    {
      name: faker.person.fullName(),
      email: "lawyer@example.com",
      image: faker.image.avatar(),
    },
  ];

  console.log(`Seeding ${admins.length} admins`.blue);

  const records = await db.user.createMany({
    data: admins,
  });

  console.log(`🎉 Seeded ${records.count} admins`.green);
  return records;
};

export default seedAdmins;
