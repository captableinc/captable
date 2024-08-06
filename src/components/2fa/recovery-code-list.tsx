import { RiClipboardLine } from "@remixicon/react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

export type RecoveryCodeListProps = {
  recoveryCodes: string[];
};

export const RecoveryCodeList = ({ recoveryCodes }: RecoveryCodeListProps) => {
  const [, copyToClipboard] = useCopyToClipboard();

  const onCopyRecoveryCodeClick = async (code: string) => {
    try {
      const result = await copyToClipboard(code);

      if (!result) {
        throw new Error("Unable to copy recovery code");
      }

      toast.success("Recovery code copied.");
      //   description: "Your recovery code has been copied to your clipboard.",
    } catch (_err) {
      toast.error("Unable to copy recovery code.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {recoveryCodes.map((code) => (
        <div
          key={code}
          className="bg-teal-50 text-muted-foreground relative rounded-lg p-4 font-mono md:text-center"
        >
          <span>{code}</span>

          <div className="absolute inset-y-0 right-4 flex items-center justify-center">
            <button
              className="opacity-60 hover:opacity-80"
              type="button"
              onClick={() => void onCopyRecoveryCodeClick(code)}
            >
              <RiClipboardLine className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
