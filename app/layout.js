import "./globals.css";
import { AppProvider } from "./providers";
import LayoutContent from "./LayoutContent";

export const metadata = {
    title: "Bonsai Hội Quán - Triển lãm và Giao lưu Bonsai Nghệ Nhân",
    description: "Nơi hội tụ những tác phẩm bonsai nghệ thuật tinh hoa của các nghệ nhân Việt Nam. Đăng bán cây cảnh, triển lãm bộ sưu tập tại nhà vườn.",
    metadataBase: new URL("https://bonsaihoiquan.vn"),
    openGraph: {
        title: "Bonsai Hội Quán - Kết Nối Nghệ Nhân Cây Cảnh",
        description: "Nơi hội tụ những tác phẩm bonsai nghệ thuật tinh hoa của các nghệ nhân Việt Nam.",
        images: ["/assets/logo.png"],
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <head>
                {/* Preconnect & Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
                {/* FontAwesome for Icons */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body>
                <AppProvider>
                    <LayoutContent>
                        {children}
                    </LayoutContent>
                </AppProvider>
            </body>
        </html>
    );
}
