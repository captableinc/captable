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
      email: "ceo@cap.new",
      image: faker.image.avatar(),
    },

    {
      name: faker.person.fullName(),
      email: "cto@cap.new",
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
