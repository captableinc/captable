import type { TUpdateOptionSchema } from "@/server/api/schema/option";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type TUpdateOption = {
  optionId: string;
  companyId: string;
  requestIp: string;
  userAgent: string;
  user: {
    id: string;
    name: string;
  };
  data: TUpdateOptionSchema;
};

export const updateOption = async (payload: TUpdateOption) => {
  try {
    const { optionId, companyId, user } = payload;

    const existingOption = await db.option.findUnique({
      where: { id: optionId },
    });

    if (!existingOption) {
      return {
        success: false,
        message: `Option with ID ${optionId} not be found`,
      };
    }

    const optionData = {
      ...existingOption,
      ...payload.data,
    };

    const updated = await db.$transaction(async (tx) => {
      const updated = await tx.option.update({
        where: { id: optionId },
        //@ts-ignore
        data: optionData,
      });

      const { id: _optionId } = updated;

      await Audit.create(
        {
          action: "option.updated",
          companyId: companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent: payload.userAgent,
            requestIp: payload.requestIp,
          },
          target: [{ type: "option", id: _optionId }],
          summary: `${user.name} updated option with option ID : ${_optionId}`,
        },
        tx,
      );

      return updated;
    });
    return {
      success: true,
      message: "🎉 Successfully updated the option.",
      data: updated,
    };
  } catch (error) {
    console.error("updateOption", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          code: "BAD_REQUEST",
          message: "Please use unique grant Id",
        };
      }
    }
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or contact support.",
    };
  }
};
