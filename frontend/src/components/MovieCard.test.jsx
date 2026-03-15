import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { MovieCard } from "./MovieCard";

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

    expect(screen.getByText(/INCEPTION/i)).toBeInTheDocument();
    
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("formats the rating to one decimal place", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    expect(screen.getByText("8.8")).toBeInTheDocument();
  });

  it("shows the 'DETAILS' button and description on hover simulation", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    const detailsBtn = screen.getByText(/DETAILS/i);
    expect(detailsBtn).toBeInTheDocument();
    
    expect(screen.getByText(/A mind-bending thriller/i)).toBeInTheDocument();
  });
});