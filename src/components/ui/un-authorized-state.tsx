import { Icon } from "@/components/ui/icon";
import EmptyState, { type EmptyStateProps } from "../common/empty-state";

export function UnAuthorizedState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      bordered={false}
      error={true}
      icon={<Icon name="door-lock-fill" />}
      title="Unauthorized"
      subtitle="You are not authorized to access this content"
      {...props}
    />
  );
}
