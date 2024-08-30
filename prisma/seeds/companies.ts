import { generatePublicId } from "@/common/id";
import type { TPrismaOrTransaction } from "@/server/db";
import { faker } from "@faker-js/faker";
import colors from "colors";
import { sample } from "lodash-es";
colors.enable();

type CompanyType = {
  name: string;
  publicId: string;
  incorporationType: string;
  incorporationDate: Date;
  incorporationState: string;
  incorporationCountry: string;

  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};
const seedCompanies = async (tx: TPrismaOrTransaction, count = 4) => {
  const companies: CompanyType[] = [];

  for (let i = 0; i < count; i++) {
    companies.push({
      name: faker.company.name(),
      publicId: generatePublicId(),
      incorporationType: sample(["llc", "c-corp", "s-corp"]),
      incorporationDate: faker.date.past(),
      incorporationState: faker.location.state({ abbreviated: true }),
      incorporationCountry: faker.location.countryCode(),

      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipcode: faker.location.zipCode(),
      country: faker.location.countryCode(),
    });
  }

  console.log(`Seeding ${companies.length} companies`.blue);

  const records = await tx.company.createManyAndReturn({
    data: companies,
    select: {
      id: true,
      name: true,
    },
  });

  console.log(`🎉 Seeded ${records.length} companies`.green);
  return records;
};

export default seedCompanies;
