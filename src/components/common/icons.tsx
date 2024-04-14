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
      width="800"
      height="800"
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 399.561C0 187.376 164.852 13.7373 373.333 0V214.583C282.872 227.536 213.333 305.419 213.333 399.561C213.333 502.767 296.907 586.434 400 586.434C441.93 586.434 480.63 572.589 511.792 549.225L663.36 700.964C593.003 762.626 500.86 800 400 800C179.086 800 0 620.716 0 399.561Z"
        fill="black"
        fillOpacity={"0.75"}
      />
      <path
        d="M701.072 663.211C762.672 592.771 800 500.53 800 399.561C800 344.38 788.848 291.806 768.683 243.973L573.611 330.767C582.037 352.058 586.667 375.268 586.667 399.561C586.667 441.535 572.843 480.277 549.504 511.473L701.072 663.211Z"
        fill="black"
        fillOpacity="0.5"
      />
      <path
        d="M426.667 214.583V0C562.219 8.93175 679.323 85.4603 744.672 196.23L546.885 284.23C517.9 247.286 475.308 221.548 426.667 214.583Z"
        fill="black"
        fillOpacity="0.25"
      />
    </svg>
  );
};
