import { type ShareContactType } from "@/schema/contacts";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";

export const commonRouter = createTRPCRouter({
  getContacts: withAuth.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const user = session.user;
    const companyId = user.companyId;
    const contacts = [] as ShareContactType[];

    const members = await db.member.findMany({
      where: {
        companyId,
      },

      include: {
        user: {
          select: {
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const stakeholders = await db.stakeholder.findMany({
      where: {
        companyId,
      },
    });
    (members || []).map((member) =>
      contacts.push({
        id: member.id,
        image: member.user.image!,
        email: member.user.email!,
        value: member.user.email!,
        name: member.user.name!,
        type: "member",
      }),
    );
    (stakeholders || []).map((stakeholder) =>
      contacts.push({
        id: stakeholder.id,
        email: stakeholder.email,
        value: stakeholder.email,
        name: stakeholder.name,
        institutionName: stakeholder.institutionName!,
        type: "stakeholder",
      }),
    );

    return contacts;
  }),
});
