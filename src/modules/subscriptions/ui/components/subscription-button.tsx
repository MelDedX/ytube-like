import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
  disabled,
  isSubscribed,
  className,
  size,
  onClick,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      disabled={disabled}
      onClick={onClick}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
