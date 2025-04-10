import "@/styles/globals.css";
import { Toaster } from "@/app/toaster";

export const metadata = {
  title: "AI Style Customizer",
  description: "Customize website styling using AI-generated CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
