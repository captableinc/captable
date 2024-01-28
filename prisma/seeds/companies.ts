import { generatePublicId } from "@/common/id";
import { faker } from "@faker-js/faker";
import { db } from "@/server/db";
import { sample } from "lodash-es";
import colors from "colors";
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
};

const seedCompanies = async (count = 4) => {
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
    });
  }

  console.log(`Seeding ${companies.length} companies`.blue);

  const records = await db.company.createMany({
    data: companies,
  });

  console.log(`🎉 Seeded ${records.count} companies`.green);
  return records;
};

export default seedCompanies;
