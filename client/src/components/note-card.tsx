import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

interface Props {
  title: string;
  category: string | undefined;
  summary: string;
  createdAt: Date;
}

const NoteCard = ({ title, category, summary, createdAt }: Props) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="line-clamp-2 leading-tight">{title}</CardTitle>
        <CardDescription className="truncate text-xs">
          {category ? category : "General"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 leading-tight text-muted-foreground text-sm">
          {summary}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {formatDistanceToNow(createdAt, {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
