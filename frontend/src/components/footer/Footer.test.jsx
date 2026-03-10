import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders the new branding Movie Vault", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // نستخدم getAllByText لأن الكلمة قد تظهر في أكثر من مكان
    // ونستخدم [0] للتأكد من وجود نسخة واحدة على الأقل
    const movieElements = screen.getAllByText(/MOVIE/i);
    const vaultElements = screen.getAllByText(/VAULT/i);

    expect(movieElements[0]).toBeInTheDocument();
    expect(vaultElements[0]).toBeInTheDocument();
  });
});