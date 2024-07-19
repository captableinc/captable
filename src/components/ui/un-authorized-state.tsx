import { RiDoorLockFill } from "@remixicon/react";
import EmptyState, { type EmptyStateProps } from "../common/empty-state";

export function UnAuthorizedState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      bordered={false}
      error={true}
      icon={<RiDoorLockFill />}
      title="Unauthorized"
      subtitle="You are not authorized to access this content"
      {...props}
    />
  );
}
