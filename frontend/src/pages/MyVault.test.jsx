import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Myvault from "./Myvault";
import axiosInstance from "../api/axiosConfig";

vi.mock("../api/axiosConfig", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
  TMDB_IMAGE_URL: "https://image.tmdb.org/t/p/w500",
}));

describe("Myvault Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    axiosInstance.get.mockReturnValue(new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <Myvault />
      </BrowserRouter>
    );

    expect(screen.getByText(/Accessing Your Vault/i)).toBeInTheDocument();
  });

  it("renders movies when API call is successful", async () => {
    const mockMovies = [
      { movie_id: 1, title: "THE GODFATHER", poster_path: "/path1.jpg" },
      { movie_id: 2, title: "PULP FICTION", poster_path: "/path2.jpg" }
    ];

    axiosInstance.get.mockResolvedValue({ data: mockMovies });

    render(
      <BrowserRouter>
        <Myvault />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/THE GODFATHER/i)).toBeInTheDocument();
      expect(screen.getByText(/PULP FICTION/i)).toBeInTheDocument();
    });

    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("shows empty vault message when no movies exist", async () => {
    axiosInstance.get.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Myvault />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Your legacy is currently empty/i)).toBeInTheDocument();
    });
  });
});