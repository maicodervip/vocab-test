# 🚀 QUICK START - Hoàn tất setup trong 2 phút!

Website đã deploy thành công tại: **https://vocabulary-4h6z6ee23-mais-projects-49729f11.vercel.app**

## ⚠️ BẠN CẦN LÀM NGAY:

### 1. Enable Firestore Database (30 giây)

1. Vào: https://console.firebase.google.com/project/vocab-test-dfcef/firestore
2. Click **"Create database"**
3. Chọn location: **asia-southeast1 (Singapore)**
4. Chọn mode: **"Start in test mode"**
5. Click **"Enable"**

### 2. Setup Firestore Rules (30 giây)

1. Vào tab **"Rules"**
2. **XÓA HẾT** code cũ
3. Paste code này:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

### 3. Enable Authentication (30 giây)

1. Vào: https://console.firebase.google.com/project/vocab-test-dfcef/authentication
2. Click **"Get started"**
3. Chọn **"Email/Password"**
4. Toggle **ON** "Email/Password"
5. Click **"Save"**

### 4. Test Website (30 giây)

1. Mở: https://vocabulary-4h6z6ee23-mais-projects-49729f11.vercel.app
2. Đăng ký với email: `test@example.com` / password: `123456`
3. Tạo workspace (chọn 🇯🇵 hoặc 🇨🇳 hoặc 🇬🇧)
4. Upload file Excel
5. Bắt đầu quiz!

---

## ✅ DONE!

Website giờ đã:
- ✅ Sử dụng Firebase Authentication (thật)
- ✅ Lưu data trên Firestore Cloud
- ✅ Secure với Firestore Rules
- ✅ Không còn dùng localStorage
- ✅ Sync across devices
- ✅ Production-ready!

## 🔗 Links quan trọng:

- **Website**: https://vocabulary-4h6z6ee23-mais-projects-49729f11.vercel.app
- **Firebase Console**: https://console.firebase.google.com/project/vocab-test-dfcef
- **Vercel Dashboard**: https://vercel.com/mais-projects-49729f11/vocabulary

## 📊 Firebase Quotas (Free Tier):

- 📖 50,000 reads/day
- ✍️ 20,000 writes/day  
- 💾 1 GB storage
- 👥 Unlimited users

Đủ cho hàng nghìn users! 🎉
