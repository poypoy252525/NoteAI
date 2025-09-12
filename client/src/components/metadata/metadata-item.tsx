import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface MetadataItemProps {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  iconBgColor?: string;
}

export const MetadataItem = ({
  icon,
  label,
  value,
  iconBgColor = "bg-primary/10",
}: MetadataItemProps) => {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border">
      <div className={`p-2 rounded-full ${iconBgColor}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <div className="mt-1">
          {typeof value === "string" ? (
            <Badge variant="outline" className="text-sm font-semibold">
              {value}
            </Badge>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
};
