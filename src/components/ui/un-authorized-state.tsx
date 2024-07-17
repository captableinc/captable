import { RiProhibitedLine } from "@remixicon/react";
import EmptyState, { type EmptyStateProps } from "../common/empty-state";

export function UnAuthorizedState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      bordered={false}
      icon={<RiProhibitedLine />}
      title="Un Authorized"
      subtitle="you don't have access to view this content."
      {...props}
    />
  );
}
