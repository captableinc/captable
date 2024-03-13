"use client";

import { useState } from "react";

type MultistepShareModalType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  trigger: React.ReactNode;
};

const MultistepShareModal = ({
  title,
  subtitle,
  trigger,
}: MultistepShareModalType) => {
  const [open, setOpen] = useState(false);

  return <div>MultistepShareModal</div>;
};

export default MultistepShareModal;
