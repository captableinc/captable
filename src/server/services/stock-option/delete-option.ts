import { Audit } from "@/server/audit";
import { db } from "@/server/db";

interface TDeleteOption {
  optionId: string;
  companyId: string;
  userAgent: string;
  requestIp: string;
  user: {
    id: string;
    name: string;
  };
}

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
      const deletedOption = await tx.option.delete({
        where: {
          id: optionId,
        },
      });

      const { stakeholderId } = deletedOption;

      await Audit.create(
        {
          action: "option.deleted",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "option", id: deletedOption.id }],
          summary: `${user.name} deleted the option for stakeholder ${stakeholderId}`,
        },
        tx,
      );

      return deletedOption;
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
        "Error deleting the option, please try again or contact support.",
    };
  }
};
