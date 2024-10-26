import "./globals.css";
import { SocketProvider } from "@/provider/SocketProvider";
import { UserProvider } from "@/provider/UserProvider";

export const metadata = {
  title: "WebMAve",
  description: "A solution to web meetings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <SocketProvider>{children}</SocketProvider>
        </UserProvider>
      </body>
    </html>
  );
}
