# CLAUDE.md

This tệp provides guidance to coding assistants when working with code in this repository.

## Project: Bonsai Hội Quán (bonsaihq)

## Workflow Rules

1. **Check Effect Range (Phạm vi ảnh hưởng)**: Trước khi chỉnh sửa bất kỳ tệp hoặc cấu trúc nào, hãy phân tích phạm vi ảnh hưởng (effect range) của nó để tránh gây lỗi liên đới (degrade) lên các phần khác.
2. **One Commit per Task (Một commit mỗi task)**: Mỗi nhiệm vụ/tính năng hoàn thành phải được đóng gói gọn gàng trong **đúng 1 commit**.
3. **Report Commit ID (Báo mã hash commit)**: Sau khi hoàn thành việc commit và đẩy code lên remote repository thành công, hãy báo lại mã commit rút gọn (short commit ID) cho người dùng.
4. **Localization**: Luôn duy trì đồng bộ 3 ngôn ngữ Tiếng Việt, Tiếng Anh và Tiếng Nhật cho cả phần nhãn giao diện (UI labels) và phần dữ liệu động (mock db).

## Build / Dev Commands

    npm install
    npm run dev           # Khởi chạy Next.js Dev Server (cổng 3000)
    npm run build         # Build production dự án Next.js
    npm run start         # Khởi chạy server production
