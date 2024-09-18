import type { TPrismaOrTransaction } from "@/server/db";
import { faker } from "@faker-js/faker";
import colors from "colors";
import { StakeholderRelationshipEnum, StakeholderTypeEnum } from "../enums";
colors.enable();

export async function seedStakeholders(
  tx: TPrismaOrTransaction,
  companyId: string,
  companyName: string,
  count = 100,
) {
  const stakeholders = [];

  for (let index = 0; index < count; index++) {
    stakeholders.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      institutionName: faker.company.name(),
      stakeholderType: faker.helpers.arrayElement(
        Object.values(StakeholderTypeEnum),
      ),
      currentRelationship: faker.helpers.arrayElement(
        Object.values(StakeholderRelationshipEnum),
      ),
      taxId: faker.finance.accountNumber(),

      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      country: faker.location.country(),
      companyId,
    });
  }
  console.log(
    `Seeding ${stakeholders.length} stakeholders for ${companyName}`.blue,
  );

  const record = await tx.stakeholder.createMany({ data: stakeholders });

  console.log(
    `🎉 Seeded ${record.count} stakeholders for ${companyName}`.green,
  );
}
