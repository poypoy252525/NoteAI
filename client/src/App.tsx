import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [test, setTest] = useState<string>("");

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setTest(data.message));
  }, []);

  return <Button>{test}</Button>;
}

export default App;
