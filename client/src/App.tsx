import { Link } from "react-router-dom";
import NoteCard from "./components/note-card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  return (
    <div>
      <header className="p-4">
        <span className="text-4xl font-semibold">Notes</span>
      </header>
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." />
          <Button asChild>
            <Link to="/note/new">New Note</Link>
          </Button>
        </div>
        <div className="py-4 grid grid-cols-1 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Link to={`/note/${index}`} key={index}>
              <NoteCard />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
