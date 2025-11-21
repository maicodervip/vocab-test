# 🚀 Quick Start - Deploy ngay!

## Option 1: Deploy với Vercel CLI (3 phút) ⚡

```bash
# 1. Cài Vercel CLI
npm install -g vercel

# 2. Login (sẽ mở browser)
vercel login

# 3. Deploy!
vercel --prod
```

✅ Xong! Copy link và chia sẻ!

---

## Option 2: Deploy với GitHub + Vercel (5 phút) 📦

### Bước 1: Push lên GitHub

```bash
# Tạo repo mới tại: https://github.com/new
# Đặt tên: vocab-tester

# Push code
git remote add origin https://github.com/YOUR_USERNAME/vocab-tester.git
git push -u origin main
```

### Bước 2: Deploy trên Vercel

1. Truy cập: https://vercel.com/new
2. Click "Import Git Repository"
3. Chọn repository `vocab-tester`
4. Click "Deploy"

✅ Xong! Vercel sẽ tự động build và deploy!

---

## 🔄 Update sau này

```bash
# Sửa code → commit → push
git add .
git commit -m "Update features"
git push
```

Vercel sẽ tự động deploy lại!

---

## ⚠️ Lưu ý quan trọng

### Về Data Storage:
- ✅ Dữ liệu lưu ở **localStorage** trình duyệt
- ✅ Mỗi người dùng có data riêng
- ✅ Không cần database/backend
- ❌ Data không đồng bộ giữa các thiết bị
- ❌ Xóa cache sẽ mất data

### Security:
- Mật khẩu được mã hóa Base64 (đơn giản)
- Phù hợp cho việc học cá nhân
- Không phù hợp cho dữ liệu nhạy cảm

---

## 📱 Chia sẻ với người khác

Sau khi deploy, bạn sẽ nhận được link như:
```
https://vocab-tester.vercel.app
```

Gửi link này cho bạn bè! Họ có thể:
- ✅ Đăng ký tài khoản riêng
- ✅ Upload file Excel của họ
- ✅ Học vocab độc lập
- ✅ Dữ liệu được lưu tự động

---

## 🆘 Cần giúp?

- 📖 Chi tiết: [DEPLOY.md](./DEPLOY.md)
- 🐛 Build lỗi: Chạy `npm run build` để kiểm tra
- 🔧 Deploy lỗi: Xem logs trên Vercel Dashboard

---

## ⚡ Deploy ngay!

```bash
# Chạy script tự động
./setup-and-deploy.sh

# Hoặc deploy trực tiếp
vercel --prod
```

🎉 Vậy là xong! Giờ bạn có thể chia sẻ link cho mọi người!
