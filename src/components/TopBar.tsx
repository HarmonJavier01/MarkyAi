import { Button } from "@/components/ui/button";

interface TopBarProps {
  onResetOnboarding: () => void;
}

export function TopBar({ onResetOnboarding }: TopBarProps) {
  return (
    <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-background">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">Content Creation Studio</span>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetOnboarding}
        >
          Reset Onboarding
        </Button>
      </div>
    </div>
  );
}
