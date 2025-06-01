import { META } from "@captable/utils/constants";
import { Hr } from "@react-email/components";
import { Link } from "./link";
import { Text } from "./text";

export interface FooterProps {
  showDivider?: boolean;
  customText?: string;
  customLink?: string;
  customLinkText?: string;
}

export const Footer = ({
  showDivider = true,
  customText,
  customLink,
  customLinkText,
}: FooterProps) => {
  return (
    <>
      {showDivider && (
        <Hr className="mx-0 my-[26px] w-full border border-solid border-neutral-200" />
      )}
      {customText ? (
        <Text
          variant="muted"
          className="mx-auto text-center text-[12px] leading-[24px] text-[#666666]"
        >
          {customText}
        </Text>
      ) : (
        <Link href={customLink || META.url} variant="muted">
          {customLinkText || META.title}
        </Link>
      )}
    </>
  );
};

export default Footer;
