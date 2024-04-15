import { cn } from "@/lib/utils";
type IconProps = React.HTMLAttributes<SVGElement>;

export const SpinnerIcon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export const LogoIcon = (props: IconProps) => {
  const { className } = props;

  return (
    <svg
      className={cn(className)}
      width="1061"
      height="1061"
      viewBox="0 0 1061 1061"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_47_2)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M712.256 270.067C704.618 283.9 687.213 288.922 673.38 281.285C565.3 221.612 426.629 237.659 335.002 329.285C223.967 440.32 223.968 620.342 335.002 731.375C426.629 823.003 565.3 839.051 673.381 779.378C687.215 771.739 704.62 776.761 712.257 790.597C719.894 804.428 714.872 821.834 701.038 829.473C571.242 901.134 404.674 881.971 294.54 771.837C161.16 638.457 161.159 422.204 294.54 288.823C404.672 178.691 571.239 159.527 701.038 231.191C714.871 238.829 719.893 256.234 712.256 270.067Z"
          fill="#090000"
          stroke="#090000"
          strokeWidth="40"
        />
        <path
          d="M820.303 351.98L819.748 351.329C817.336 348.495 813.975 344.546 810.463 341.507C805.819 337.487 798.764 333.067 789.033 332.68C779.007 332.285 771.505 336.441 766.714 340.016C762.966 342.813 759.236 346.55 756.445 349.348L615.807 489.986C610.966 494.823 605.731 500.054 601.908 505.065C597.429 510.935 592.608 519.335 592.607 530.461C592.608 541.588 597.427 549.988 601.906 555.859C605.73 560.87 610.965 566.1 615.807 570.938L756.445 711.576C759.237 714.373 762.967 718.112 766.715 720.909C771.506 724.48 779.009 728.639 789.035 728.243C798.764 727.86 805.819 723.436 810.463 719.418C813.976 716.378 817.335 712.43 819.747 709.595L820.305 708.945C907.887 606.306 907.886 454.618 820.303 351.98Z"
          fill="#090000"
        />
      </g>
      <defs>
        <clipPath id="clip0_47_2">
          <rect
            width="750"
            height="750"
            fill="white"
            transform="translate(530.33) rotate(45)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const CheckIcon = (props: IconProps) => {
  const { className } = props;
  return (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

export const CloseIcon = (props: IconProps) => {
  const { className } = props;
  return (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
};

export function ClipboardIcon(props: IconProps) {
  const { className } = props;

  return (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

export function TeamIcon(props: IconProps) {
  const { className } = props;
  return (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
