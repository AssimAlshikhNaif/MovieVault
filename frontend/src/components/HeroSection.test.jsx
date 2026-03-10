import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { HeroSection } from "./HeroSection";

describe("HeroSection Component", () => {
  // اختبار الحالة الأولى: عندما لا يكون المستخدم مسجلاً (Unlock Your Legacy)
  it("renders correctly for guest users", () => {
    // التأكد من أن التوكن فارغ للاختبار
    localStorage.removeItem('token');

    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    // التحقق من وجود العنوان الضخم (UNVEIL)
    expect(screen.getByText(/UNVEIL/i)).toBeInTheDocument();
    
    // التحقق من وجود الزر الخاص بغير المسجلين
    expect(screen.getByText(/Unlock Your Legacy/i)).toBeInTheDocument();
    
    // التحقق من وجود زر استكشاف المكتبة
    expect(screen.getByText(/Explore Library/i)).toBeInTheDocument();
  });

  // اختبار الحالة الثانية: عندما يكون المستخدم مسجلاً (Access My Legacy)
  it("renders correctly for logged in users", () => {
    // محاكاة وجود توكن (تسجيل دخول)
    localStorage.setItem('token', 'mock-token');

    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    // التحقق من تغير نص الزر بناءً على الكود الخاص بك
    expect(screen.getByText(/Access My Legacy/i)).toBeInTheDocument();
    
    // تنظيف التوكن بعد الاختبار
    localStorage.removeItem('token');
  });

  // اختبار وظيفة الزر (Scroll)
  it("scrolls to content when explore is clicked", () => {
    // محاكاة دالة scrollTo الخاصة بـ window
    window.scrollTo = vi.fn();
    
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    const exploreButton = screen.getByText(/Explore Library/i);
    fireEvent.click(exploreButton);

    // التأكد من أن الضغط على الزر يستدعي وظيفة السكرول
    expect(window.scrollTo).toHaveBeenCalled();
  });
});