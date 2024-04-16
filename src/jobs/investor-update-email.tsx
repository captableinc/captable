import { generatePublicId } from "@/common/id";
import { InvestorUpdate } from "@/emails/InvestorUpdate";
import { UpdateEmailStatusEnum } from "@/prisma-enums";
import { db } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { client } from "@/trigger";
import { invokeTrigger } from "@trigger.dev/sdk";
import { render } from "jsx-email";

export const investorUpdateEmailJob = client.defineJob({
  id: "investor-updates",
  name: "Investor Updates",
  version: "1.0.1",
  trigger: invokeTrigger(),
  run: async (payload, io) => {
    /**   
            If the goal is to run task only once, try using unique cache key.
            Function won't run for second time for same cache key.
        **/

    //@TODO ( Execute parallel tasks (not supported yet))
    for (const stakeholder of payload?.stakeholders) {
      await io.runTask(`stakeholder-${stakeholder?.id}`, async () => {
        //eslint-disable-next-line @typescript-eslint/no-floating-promises
        sendMail({
          to: stakeholder?.email,
          subject: payload?.title,
          html: await render(
            <InvestorUpdate
              html={payload?.html}
              title={payload?.title}
              companyName={payload?.companyName}
              companyLogo={payload?.companyLogo}
              authorName={payload?.authorName}
              authorImage={payload?.authorImage}
              authorTitle={payload?.authorTitle}
            />,
          ),
        });
      });
    }

    //@TODO ( Debatable approach introducing bulk update)
    await io.runTask(
      `${generatePublicId()}-${generatePublicId()}`,
      async () => {
        return await db.updateRecipient.updateMany({
          where: {
            stakeholderId: { in: payload?.stakeholderIds },
          },
          data: {
            status: UpdateEmailStatusEnum.SENT,
            sentAt: new Date(),
          },
        });
      },
    );

    if (!payload?.isFirstEmailSent && payload?.publicId) {
      const publicId = payload?.publicId as string;
      //@ts-expect-error check
      await io.runTask(publicId, async () => {
        return await db.update.update({
          where: {
            publicId,
          },
          data: {
            sentAt: new Date(),
          },
        });
      });
    }
  },
});
