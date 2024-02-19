import type { MembershipStatusEnum } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { db } from "@/server/db";
import colors from "colors";
colors.enable();

type UserType = {
  name: string;
  email: string;
  title?: string;
  image?: string;
  isOnboarded?: boolean;
  status?: MembershipStatusEnum;
};

const seedTeam = async () => {
  const team = [
    {
      name: faker.person.fullName(),
      email: "ceo@example.com",
      image: faker.image.avatar(),
      title: "Co-Founder & CEO",
      status: "ACTIVE",
      isOnboarded: true,
    },

    {
      name: faker.person.fullName(),
      email: "cto@example.com",
      image: faker.image.avatar(),
      title: "Co-Founder & CTO",
      status: "ACTIVE",
      isOnboarded: true,
    },

    {
      name: faker.person.fullName(),
      email: "cfo@example.com",
      image: faker.image.avatar(),
      title: "CFO",
      status: "PENDING",
      isOnboarded: false,
    },

    {
      name: faker.person.fullName(),
      email: "lawyer@example.com",
      image: faker.image.avatar(),
      title: "Lawyer at Law Firm LLP",
      status: "PENDING",
    },
    {
      name: faker.person.fullName(),
      email: "accountant@example.com",
      image: faker.image.avatar(),
      title: "Accountant at XYZ Accounting, Inc.",
      status: "INACTIVE",
    },
  ];

  console.log(`Seeding ${team.length} team members`.blue);
  const companies = await db.company.findMany();

  team.forEach(async (t) => {
    const { name, email, image, title, status, isOnboarded } = t;
    const user = await db.user.create({
      data: {
        name,
        email,
        image,
      },
    });

    companies.forEach(async (company) => {
      await db.membership.create({
        data: {
          title,
          isOnboarded,
          status: status as MembershipStatusEnum,
          userId: user.id,
          companyId: company.id,
        },
      });
    });
  });

  console.log(`🎉 Seeded ${team.length} team members`.green);
  return team;
};

export default seedTeam;
