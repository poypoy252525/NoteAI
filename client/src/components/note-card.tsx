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

const NoteCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Exam</CardTitle>
        <CardDescription>Study</CardDescription>
        <CardAction>
          <Button size="icon" variant="ghost">
            <EllipsisVerticalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt,
          at!
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground">Just now</p>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
