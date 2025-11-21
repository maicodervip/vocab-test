# 🚀 Hướng dẫn Deploy lên Vercel

## Cách 1: Deploy qua Vercel CLI (Khuyên dùng)

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Login vào Vercel
```bash
vercel login
```

### Bước 3: Deploy
```bash
vercel
```

Lần đầu tiên sẽ hỏi một số câu hỏi:
- Set up and deploy? **Y**
- Which scope? Chọn account của bạn
- Link to existing project? **N** (nếu là lần đầu)
- What's your project's name? **vocab-tester** (hoặc tên bạn muốn)
- In which directory is your code located? **./** (enter)

### Bước 4: Deploy Production
```bash
vercel --prod
```

✅ Xong! Bạn sẽ nhận được link như: `https://vocab-tester.vercel.app`

---

## Cách 2: Deploy qua Vercel Dashboard (Dễ hơn)

### Bước 1: Đẩy code lên GitHub

1. Tạo repository trên GitHub: https://github.com/new

2. Khởi tạo git và push code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vocab-tester.git
git push -u origin main
```

### Bước 2: Import vào Vercel

1. Truy cập: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Chọn repository **vocab-tester**
4. Click **"Deploy"**

⚠️ Vercel sẽ tự động:
- Phát hiện Vite project
- Chạy `npm install`
- Chạy `npm run build`
- Deploy thư mục `dist/`

✅ Deploy thành công!

---

## 🔄 Auto Deploy

Khi bạn push code mới lên GitHub, Vercel sẽ tự động rebuild và deploy!

```bash
git add .
git commit -m "Update features"
git push
```

---

## 🌐 Custom Domain (Tùy chọn)

Sau khi deploy, bạn có thể thêm domain riêng:
1. Vào Vercel Dashboard
2. Chọn project **vocab-tester**
3. Settings → Domains
4. Thêm domain của bạn

---

## 📱 Chia sẻ link

Sau khi deploy, bạn có thể chia sẻ link cho bất kỳ ai:
- Link Vercel: `https://vocab-tester.vercel.app`
- Hoặc domain riêng của bạn

⚠️ **Lưu ý về Data:**
- Dữ liệu được lưu ở **localStorage** trên trình duyệt của từng người dùng
- Mỗi thiết bị sẽ có dữ liệu riêng biệt
- Xóa cache/data trình duyệt sẽ mất dữ liệu

---

## 🔧 Troubleshooting

### Lỗi "Command failed: npm run build"
- Kiểm tra lại code có lỗi không
- Chạy `npm run build` local để test

### Lỗi "Module not found"
- Đảm bảo `package.json` có đầy đủ dependencies
- Chạy `npm install` lại

### Website bị lỗi sau deploy
- Kiểm tra Console trong browser (F12)
- Xem logs trên Vercel Dashboard
