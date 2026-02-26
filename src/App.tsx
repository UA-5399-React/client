import { RouterProvider } from "@tanstack/react-router";
import { router } from "./lib/router";

function App() {
  return (
    <div className="h-screen w-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
