"use client";

import {
  DescendantProvider,
  createDescendantContext,
  useDescendant,
  useDescendants,
  useDescendantsInit,
} from "@/providers/descendants";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import Modal, { type ModalProps } from "../shared/modal";
import { Button, type ButtonProps } from "./button";
import { Card } from "./card";
import { DialogFooter } from "./dialog";

const StepperDescendantContext = createDescendantContext(
  "StepperDescendantContext",
);

type TStepperContext = {
  activeIndex: number;
  prev: () => void;
  next: () => void;
};

const StepperContext = createContext<TStepperContext | null>(null);

interface StepperRootProps {
  children: ReactNode;
}

export function useStepper() {
  const data = useContext(StepperContext);

  if (!data) {
    throw new Error("useStepper hook should be used inside StepperRoot");
  }

  return data;
}

interface StepperStepProps extends ComponentProps<"div"> {
  children: ReactNode;
  title: string;
}

export function StepperStep({ children, title, ...rest }: StepperStepProps) {
  const { activeIndex } = useStepper();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleRefSet = useCallback((refValue: HTMLDivElement) => {
    ref.current = refValue;
    setElement(refValue);
  }, []);

  const descendant = useMemo(() => {
    return {
      // Assign the DOM node using a stateful reference. This should be safer
      // than passing the ref directly.
      element,
      data: {
        title,
      },
    };
  }, [element, title]);

  const index = useDescendant(
    descendant,

    StepperDescendantContext,
  );
  const isSelected = index === activeIndex;

  return (
    <div {...rest} ref={handleRefSet}>
      {isSelected ? children : null}
    </div>
  );
}

export function StepperRoot({ children }: StepperRootProps) {
  const [descendants, setDescendants] = useDescendantsInit();
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    if (descendants.length !== activeIndex) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prev = () => {
    if (activeIndex !== 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <DescendantProvider
      context={StepperDescendantContext}
      items={descendants}
      set={setDescendants}
    >
      <StepperContext.Provider value={{ activeIndex, next, prev }}>
        {children}
      </StepperContext.Provider>
    </DescendantProvider>
  );
}

type StepperModalProps = ModalProps;

function StepList() {
  const steps = useDescendants(StepperDescendantContext);
  return steps.map((step) => <li key={step.data.title}>{step.data.title}</li>);
}

export function StepperModal({
  children,
  size = "4xl",
  ...rest
}: StepperModalProps) {
  return (
    <StepperRoot>
      <Modal size={size} {...rest}>
        <div className="grid grid-cols-10">
          <nav
            aria-label="Progress"
            className="red col-span-3 hidden max-w-64 md:block"
          >
            <StepList />
          </nav>
          <div className="col-span-12 space-y-6 md:col-span-7">
            <Card className="p-6">{children}</Card>
          </div>
        </div>
      </Modal>
    </StepperRoot>
  );
}

interface StepperModalContentProps {
  children: ReactNode;
}

export function StepperModalContent({ children }: StepperModalContentProps) {
  const steps = useDescendants(StepperDescendantContext);
  const { activeIndex } = useStepper();
  const currentTitle = steps?.[activeIndex]?.data?.title ?? "";
  return (
    <div>
      <h5 className="text-lg font-medium">{currentTitle}</h5>
      {children}
    </div>
  );
}

export function StepperModalFooter({
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <DialogFooter {...rest}>{children}</DialogFooter>;
}

export function StepperPrev({
  children,
  ...rest
}: ButtonProps & { children: ReactNode }) {
  const { prev } = useStepper();

  return (
    <Button variant="outline" onClick={prev} {...rest}>
      {children}
    </Button>
  );
}

export function StepperNext({
  children,
  ...rest
}: ButtonProps & { children: ReactNode }) {
  const { next } = useStepper();

  return (
    <Button onClick={next} {...rest}>
      {children}
    </Button>
  );
}
