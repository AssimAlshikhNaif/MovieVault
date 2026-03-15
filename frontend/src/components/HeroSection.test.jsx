
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { HeroSection } from "./HeroSection";

describe("HeroSection Component", () => {
  it("renders correctly for guest users", () => {
    localStorage.removeItem('token');

    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    expect(screen.getByText(/UNVEIL/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Unlock Your Legacy/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Explore Library/i)).toBeInTheDocument();
  });

  it("renders correctly for logged in users", () => {
    localStorage.setItem('token', 'mock-token');

    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    expect(screen.getByText(/Access My Legacy/i)).toBeInTheDocument();
    
    localStorage.removeItem('token');
  });

  it("scrolls to content when explore is clicked", () => {
    window.scrollTo = vi.fn();
    
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    const exploreButton = screen.getByText(/Explore Library/i);
    fireEvent.click(exploreButton);

    expect(window.scrollTo).toHaveBeenCalled();
  });
});