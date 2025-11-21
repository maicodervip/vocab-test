# Vocab Tester - Ứng dụng học từ vựng tiếng Nhật

Ứng dụng học từ vựng tiếng Nhật hiện đại với giao diện đẹp mắt và tính năng mạnh mẽ.

## ✨ Tính năng

- 👤 **Quản lý User**: Đăng ký/đăng nhập với mật khẩu
- 💾 **Lưu trữ vĩnh viễn**: Dữ liệu được lưu tự động (localStorage)
- 📚 **Quản lý Units**: Tải lên và lưu trữ nhiều file Excel
- 🗑️ **Xóa Units**: Xóa units không cần thiết
- 🎯 **2 Chế độ học**:
  - Tiếng Nhật → Tiếng Việt
  - Tiếng Việt → Tiếng Nhật
- ✅ **Kiểm tra tức thời**: Kiểm tra đáp án ngay lập tức
- 📊 **Thống kê chi tiết**: Xem điểm số và danh sách từ sai
- 🔄 **Ôn tập thông minh**: Ôn lại chỉ những từ trả lời sai
- 📱 **Responsive**: Tối ưu cho mobile và tablet
- 🎨 **UI/UX đẹp**: Giao diện hiện đại với hiệu ứng mượt mà

## 📋 Yêu cầu

- Node.js 18+ và npm/yarn

## 🚀 Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm run dev
```

3. Mở trình duyệt tại: `http://localhost:5173`

## 📝 Định dạng file Excel

File Excel cần có định dạng:
- **Cột 1**: Từ vựng ngôn ngữ đang học (bắt buộc)
- **Cột 2**: Đáp án thay thế (optional - để trống nếu không có)
- **Cột 3**: Nghĩa tiếng Việt (bắt buộc)

Ví dụ:
```
| こんにちは | こんにちわ | Xin chào |
| ありがとう |            | Cảm ơn   |
| さようなら |            | Tạm biệt |
```

**Lưu ý**: Cột 2 có thể để trống nếu không có đáp án thay thế.

## 🎮 Cách sử dụng

1. **Đăng ký/Đăng nhập**: Tạo tài khoản hoặc đăng nhập với tài khoản có sẵn
2. **Tải file Excel**: Click nút "Tải file Excel" và chọn file từ vựng
3. **Chọn Unit**: Click vào unit bạn muốn học
4. **Chọn chế độ**: Chọn chế độ học phù hợp với bạn
5. **Làm bài**: Nhập câu trả lời và nhấn Enter hoặc nút "Kiểm tra"
6. **Xem kết quả**: Xem điểm số và ôn lại những từ sai

## 🚀 Deploy

Xem hướng dẫn chi tiết tại [DEPLOY.md](./DEPLOY.md)

### Deploy nhanh:
```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Hoặc sử dụng script:
```bash
./deploy.sh
```

## 🛠️ Công nghệ

- React 18
- TypeScript
- Vite
- xlsx (đọc file Excel)
- lucide-react (icons)

## 📂 Cấu trúc thư mục

```
vocab_test/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx       # Trang chủ
│   │   ├── HomePage.css
│   │   ├── QuizPage.tsx       # Trang quiz
│   │   ├── QuizPage.css
│   │   ├── LoginPage.tsx      # Trang đăng nhập
│   │   └── LoginPage.css
│   ├── services/
│   │   └── storage.ts         # LocalStorage service
│   ├── types.ts               # TypeScript types
│   ├── utils.ts               # Utilities
│   ├── App.tsx                # Main app
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── vocab_file/                # Thư mục chứa file Excel
├── deploy.sh                  # Deploy script
├── DEPLOY.md                  # Hướng dẫn deploy
├── package.json
└── vite.config.ts
```

## 💾 Lưu trữ dữ liệu

- Dữ liệu được lưu trong **localStorage** của trình duyệt
- Mỗi user có dữ liệu riêng biệt
- Dữ liệu sẽ tồn tại vĩnh viễn (trừ khi xóa cache)
- **Lưu ý**: Dữ liệu chỉ tồn tại trên thiết bị cụ thể, không đồng bộ giữa các thiết bị

## 💡 Tips

- Nhấn **Enter** để kiểm tra đáp án nhanh
- Sử dụng tính năng "Ôn lại câu sai" để học hiệu quả hơn
- Thử cả 2 chế độ để ghi nhớ từ vựng tốt hơn

## 🎨 Screenshots

### Trang chủ
Giao diện hiện đại với danh sách các unit

### Chọn chế độ
2 chế độ học linh hoạt

### Quiz
Giao diện học trực quan với progress bar

### Kết quả
Thống kê chi tiết và ôn tập thông minh

---

Made with ❤️ for Japanese learners
