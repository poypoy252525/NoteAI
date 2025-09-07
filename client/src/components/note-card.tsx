import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{category ? category : "General"}</CardDescription>
        <CardAction>
          <Button size="icon" variant="ghost">
            <EllipsisVerticalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2">{summary}</p>
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
