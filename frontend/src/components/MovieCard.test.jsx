import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { MovieCard } from "./MovieCard";

// محاكاة مكتبة التوست لكي لا تظهر رسائل حقيقية أثناء الاختبار
vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(),
  },
}));

describe("MovieCard Component", () => {
  const mockMovie = {
    id: 123,
    title: "INCEPTION",
    vote_average: 8.832,
    poster_path: "/test-path.jpg",
    overview: "A mind-bending thriller.",
    release_date: "2010-07-16",
  };

  it("renders movie title and release year correctly", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // التأكد من ظهور العنوان (بالحروف الكبيرة كما في كودك)
    expect(screen.getByText(/INCEPTION/i)).toBeInTheDocument();
    
    // التأكد من قص السنة من تاريخ الإصدار (2010)
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("formats the rating to one decimal place", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // 8.832 يجب أن تظهر 8.8 بناءً على toFixed(1) في كودك
    expect(screen.getByText("8.8")).toBeInTheDocument();
  });

  it("shows the 'DETAILS' button and description on hover simulation", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // زر التفاصيل موجود دائماً لكنه مخفي بصرياً بـ CSS، الاختبار سيجده في الـ DOM
    const detailsBtn = screen.getByText(/DETAILS/i);
    expect(detailsBtn).toBeInTheDocument();
    
    // التأكد من وجود الوصف
    expect(screen.getByText(/A mind-bending thriller/i)).toBeInTheDocument();
  });
});