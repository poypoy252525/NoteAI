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

interface Props {
  title: string;
  category: string | undefined;
  content: string;
  createdAt: Date;
}

const NoteCard = ({ title, category, content, createdAt }: Props) => {
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
        <p className="line-clamp-2">{content}</p>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-xs">
          {new Date(createdAt).toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
