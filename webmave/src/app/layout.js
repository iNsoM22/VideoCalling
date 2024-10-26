import "./globals.css";

export const metadata = {
  title: "WebMAve",
  description: "A solution to web meetings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
