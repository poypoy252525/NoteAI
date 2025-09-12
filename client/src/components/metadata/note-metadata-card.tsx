import { formatDistanceToNow, format } from "date-fns";
import { Calendar, Clock, Tag } from "lucide-react";
import { MetadataItem } from "@/components/metadata/metadata-item";

interface NoteMetadataCardProps {
  createdAt: Date;
  updatedAt: Date;
  category: string | null;
}

export const NoteMetadataCard = ({
  createdAt,
  updatedAt,
  category,
}: NoteMetadataCardProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Creation Date */}
      <MetadataItem
        icon={<Calendar className="h-4 w-4 text-primary " />}
        label="Created"
        value={format(new Date(createdAt), "MMM dd, yyyy")}
        iconBgColor="bg-accent"
      />

      {/* Last Updated */}
      {updatedAt !== createdAt && (
        <MetadataItem
          icon={<Clock className="h-4 w-4" />}
          label="Updated"
          value={formatDistanceToNow(new Date(updatedAt), {
            addSuffix: true,
          })}
          iconBgColor="bg-accent"
        />
      )}

      {/* Category */}
      <MetadataItem
        icon={<Tag className="h-4 w-4" />}
        label="Category"
        value={
          category ? (
            <span className="text-sm font-semibold">{category}</span>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Uncategorized
            </span>
          )
        }
        iconBgColor="bg-accent"
      />
    </div>
  );
};
