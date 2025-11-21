# Firebase Setup Guide

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** (Thêm dự án)
3. Đặt tên project: `vocab-test` (hoặc tên bạn muốn)
4. Tắt Google Analytics (không bắt buộc)
5. Click **"Create project"**

## Bước 2: Đăng ký Web App

1. Trong Firebase Console, click icon **Web** (</>) để thêm Firebase vào web app
2. Đặt nickname: `Vocab Tester Web`
3. **KHÔNG** chọn "Firebase Hosting" (vì đã dùng Vercel)
4. Click **"Register app"**
5. Copy thông tin Firebase config (bạn sẽ cần nó)

## Bước 3: Enable Authentication

1. Vào sidebar > **Authentication**
2. Click **"Get started"**
3. Tab **"Sign-in method"**
4. Click **"Email/Password"**
5. Enable **"Email/Password"**
6. Click **"Save"**

## Bước 4: Enable Firestore Database

1. Vào sidebar > **Firestore Database**
2. Click **"Create database"**
3. Chọn location gần nhất (ví dụ: `asia-southeast1`)
4. Chọn mode: **"Start in test mode"** (cho development)
   - Sau này có thể đổi rules để bảo mật hơn
5. Click **"Enable"**

## Bước 5: Cấu hình Firestore Rules (Quan trọng!)

Vào tab **"Rules"** trong Firestore và paste rules này:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspace documents
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

Click **"Publish"**

## Bước 6: Thêm Environment Variables vào Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project **vocab-test**
3. Vào **Settings** > **Environment Variables**
4. Thêm các biến sau (lấy từ Firebase config):

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=vocab-test.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vocab-test
VITE_FIREBASE_STORAGE_BUCKET=vocab-test.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

5. Chọn môi trường: **Production, Preview, Development**
6. Click **"Save"**

## Bước 7: Redeploy Project

1. Vào tab **Deployments** trong Vercel
2. Click **"Redeploy"** trên deployment mới nhất
3. Chọn **"Use existing Build Cache"**
4. Click **"Redeploy"**

## Bước 8: Test

1. Mở https://vocabulary-five-eta.vercel.app
2. Đăng ký tài khoản mới với email
3. Tạo workspace (chọn ngôn ngữ)
4. Upload file Excel
5. Test quiz
 
## Lưu ý

- **Development local**: Tạo file `.env` trong root folder và copy environment variables
- **Firebase Pricing**: Free tier (Spark Plan) đủ cho project nhỏ:
  - 50K reads/day
  - 20K writes/day
  - 1GB storage
- **Security**: Firestore rules đã được cấu hình để chỉ user có thể đọc/ghi data của chính họ

## Troubleshooting

### Lỗi "Firebase: Error (auth/configuration-not-found)"
- Check lại Firebase Config trong Vercel environment variables
- Đảm bảo đã enable Authentication > Email/Password

### Lỗi "Missing or insufficient permissions"
- Check Firestore Rules đã được publish chưa
- Đảm bảo userId trong workspace documents match với auth.uid

### Website không load được data
- Mở Developer Tools > Console để xem lỗi
- Check Network tab xem có request nào fail không
- Verify Firestore Database đã được create và có data
