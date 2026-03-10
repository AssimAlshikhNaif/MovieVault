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

    // التحقق من اسم المشروع (Movie Vault)
    expect(screen.getByText(/Movie/i)).toBeInTheDocument();
    expect(screen.getByText(/Vault/i)).toBeInTheDocument();

    // التحقق من وجود الحقول باستخدام الـ Placeholder التي وضعتها في كودك
    expect(screen.getByPlaceholderText(/Unique alias/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Personal address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

    // التحقق من زر الإرسال
    expect(screen.getByRole("button", { name: /Finalize Membership/i })).toBeInTheDocument();
  });

  it("updates input values on change", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Unique alias/i);
    
    // محاكاة كتابة اسم مستخدم
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

    // الحالة الافتراضية: password
    expect(passwordInput.type).toBe("password");

    // الضغط على زر العين
    fireEvent.click(toggleButton);
    
    // يجب أن يتغير النوع إلى text
    expect(passwordInput.type).toBe("text");
  });
});