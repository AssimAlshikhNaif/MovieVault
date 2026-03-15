import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Register from "./Register";

// 1. محاكاة مكتبة التوست لضمان عدم حدوث أخطاء أثناء الاختبار
vi.mock("react-hot-toast", () => ({
  default: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Register Page Component", () => {
  it("renders all registration fields and branding", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText(/Movie/i)).toBeInTheDocument();
    expect(screen.getByText(/Vault/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Unique alias/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Personal address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Finalize Membership/i })).toBeInTheDocument();
  });

  it("updates input values on change", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Unique alias/i);
    
    fireEvent.change(usernameInput, { target: { value: 'king_cinematic' } });
    expect(usernameInput.value).toBe('king_cinematic');
  });

  it("toggles password visibility when eye icon is clicked", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const toggleButton = screen.getByRole("button", { name: "" }); // زر العين ليس له نص، نختاره عبر الـ tag

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleButton);
    
    expect(passwordInput.type).toBe("text");
  });
});