import { faker } from "@faker-js/faker";
import { sample } from "lodash-es";
import { db } from "@/server/db";
import colors from "colors";
colors.enable();

import type { MEMBERHIP_STATUS, MEMBERSHIP_ACCESS } from "@/prisma-enums";

type UserType = {
  name: string;
  email: string;
  image?: string;
};

type MembershipType = {
  title: string;
  active: boolean;
  status: MEMBERHIP_STATUS;
  access: MEMBERSHIP_ACCESS;
  isOnboarded: boolean;
  userId: string;
  companyId: string;
};

const seedStakeholders = async (count = 25) => {
  const emails: string[] = [];
  const users: UserType[] = [];
  const stakeholders: MembershipType[] = [];

  const admins = await db.user.findMany();
  const companies = await db.company.findMany();

  for (let i = 0; i < count; i++) {
    const email = faker.internet.email();
    emails.push(email);
    users.push({
      name: faker.person.fullName(),
      email: email,
      image: faker.image.avatar(),
    });
  }

  console.log(`Seeding ${users.length} users`.blue);

  const records = await db.user.createMany({
    data: users,
  });

  const userRecords = await db.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  console.log(`🎉 Seeded ${records.count} users`.green);

  companies.forEach((company) => {
    admins.forEach((admin) => {
      const title = admin.email?.includes("ceo")
        ? "CEO"
        : admin.email?.includes("cto")
          ? "CTO"
          : admin.email?.includes("cfo")
            ? "CFO"
            : "Lawyer at Lawfirm LLP";

      stakeholders.push({
        title,
        active: true,
        status: "ACCEPTED",
        access: "ADMIN",
        isOnboarded: true,
        userId: admin.id,
        companyId: company.id,
      });
    });

    userRecords.forEach((user) => {
      stakeholders.push({
        title: faker.name.jobTitle(),
        active: sample([true, false]) as boolean,
        status: sample(["ACCEPTED", "PENDING"]),
        access: "STAKEHOLDER",
        isOnboarded: true,
        userId: user.id,
        companyId: company.id,
      });
    });
  });

  console.log(`Seeding ${stakeholders.length} stakeholders`.blue);

  const membershipRecords = await db.membership.createMany({
    data: stakeholders,
  });

  console.log(`🎉 Seeded ${membershipRecords.count} stakeholders`.green);

  return membershipRecords;
};

export default seedStakeholders;
