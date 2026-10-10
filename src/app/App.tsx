import { HomePage } from "./HomePage";
import { CareersPage } from "./careers/CareersPage";
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/careers") return <CareersPage />;
  return <HomePage />;
}
