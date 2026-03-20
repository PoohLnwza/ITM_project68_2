# Cyberpark Project

## วิธีการรันโปรเจกต์ (สำหรับเพื่อนที่ Clone ไป)

โปรเจกต์นี้ใช้ **Docker Compose** เพื่อให้สามารถรันทั้ง Frontend, Backend (API), และ Database พร้อมกันได้ในคำสั่งเดียว โดยไม่ต้องลง Python, PostgreSQL, หรือ Web Server เองเลย

### สิ่งที่ต้องมี

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ติดตั้งอยู่ในเครื่อง

### ขั้นตอนการรัน

1. Clone หรือ Download โฟลเดอร์โปรเจกต์นี้
2. เปิด Terminal (หรือ Command Prompt) แล้วเข้าไปที่โฟลเดอร์โปรเจกต์ (`/secure-sensei`)
3. รันคำสั่งนี้:
   docker-compose up -d --build
4. รอโหลด Image
5. เข้าใช้งานได้เลย
   - **Frontend (หน้าเว็บ):** http://localhost:8080
   - **Backend API Docs:** http://localhost:8000/docs
   - **Database (PostgreSQL):** `localhost:5432` (User: `myuser`, Pass: `mypassword`)

### การเตรียมข้อมูล

เมื่อคุณสั่งรันโปรเจกต์ โค้ดส่วน Backend จะทำการฝังข้อมูลเนื้อหาในโมดูลทั้งหมด (Linux และ Network) เข้าสู่ฐานข้อมูล Vector Database ให้โดยอัตโนมัติ 100% (ผ่านไฟล์ `start.sh`) 

---

_หมายเหตุ: โฟลเดอร์ `models--BAAI--bge-m3` จะถูกโหลดใหม่โดยไลบรารี SentenceTransformer อัตโนมัติเมื่อรันครั้งแรก_
