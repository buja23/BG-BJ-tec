import ThemeToggle from "./components/ThemeToggle";
import LoginForm from "./components/LoginForm";
import "./index.css";
import "./theme.css";

export default function App() {
  return (
    <div className="login-container">
      <ThemeToggle />
      <LoginForm />
    </div>
  );
}
