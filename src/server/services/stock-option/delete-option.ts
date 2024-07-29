import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import type { TUpdateOption } from "./update-option";

type TDeleteOption = Omit<TUpdateOption, "data">;

export const deleteOption = async ({
  optionId,
  companyId,
  requestIp,
  userAgent,
  user,
}: TDeleteOption) => {
  try {
    const existingOption = await db.option.findUnique({
      where: {
        id: optionId,
      },
    });

    if (!existingOption) {
      return {
        success: false,
        code: "NOT_FOUND",
        message: `Option with ID ${optionId} not found`,
      };
    }

    const option = await db.$transaction(async (tx) => {
      const deleted = await tx.option.delete({
        where: {
          id: optionId,
        },
      });

      const { stakeholderId } = deleted;

      await Audit.create(
        {
          action: "option.deleted",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "option", id: deleted.id }],
          summary: `${user.name} deleted the option for stakeholder ${stakeholderId}`,
        },
        tx,
      );

      return deleted;
    });
    return {
      success: true,
      message: "🎉 Successfully deleted the option",
      option,
    };
  } catch (error) {
    console.error("Error Deleting the option: ", error);
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Error deleting the option, please try again or contact support.",
    };
  }
};
