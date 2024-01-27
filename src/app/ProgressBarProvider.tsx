"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

type ProviderProps = {
  children: React.ReactNode;
};

const ProgressBarProvider = ({ children }: ProviderProps) => {
  return (
    <>
      <ProgressBar
        height="2px"
        color="#18181b"
        options={{ showSpinner: true }}
        shallowRouting={true}
      />
      {children}
    </>
  );
};

export default ProgressBarProvider;
