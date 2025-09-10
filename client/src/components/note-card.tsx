import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Clock, EllipsisVerticalIcon } from "lucide-react";
import { Button } from "./ui/button";

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
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="truncate">
          {category ? category : "General"}
        </CardDescription>
        <CardAction>
          <Button size="icon" variant="ghost">
            <EllipsisVerticalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 leading-tight">{summary}</p>
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
