import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Vhi Professional Button Component", () => {
  it("renders correctly with default text", () => {
    render(<Button>Apply for Graduate Programme</Button>);
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  it("applies the correct CSS classes for the primary variant", () => {
    render(<Button variant="default">Submit</Button>);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("bg-blue-700");
  });

  it("is accessible and can be disabled", () => {
    render(<Button disabled>Apply Now</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("supports mobile sizing classes for responsive layouts", () => {
    render(<Button size="sm">Mobile View</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });
});
