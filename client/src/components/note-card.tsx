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
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  title: string;
  category: string | undefined;
  summary: string;
  createdAt: Date;
}

const NoteCard = ({ title, category, summary, createdAt }: Props) => {
  return (
    <Card>
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
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
