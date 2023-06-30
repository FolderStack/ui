import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
    title: "Furnx DAM",
    description: "Digital Asset Management",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ margin: "0px" }}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
