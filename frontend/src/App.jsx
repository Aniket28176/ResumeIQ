import { AuthProvider } from "./features/auth/auth.context";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { InterviewProvider } from "./features/interview/interview.context";


export default function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}