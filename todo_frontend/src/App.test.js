import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders todo title and add button", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /todo/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
});
