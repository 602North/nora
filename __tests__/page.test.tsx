import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Lead capture page", () => {
  it("renders the quote form heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /get a free quote/i })
    ).toBeInTheDocument();
  });

  it("renders the required form fields", () => {
    render(<Home />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<Home />);
    expect(
      screen.getByRole("button", { name: /request a quote/i })
    ).toBeInTheDocument();
  });
});
