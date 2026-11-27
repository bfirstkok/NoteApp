# 📝 บันทึกของฉัน (Notes App)

แอปพลิเคชันจดบันทึกแบบ Web App ที่ใช้งานได้ทันทีในเบราว์เซอร์ ไม่ต้องติดตั้งเพิ่มเติม ข้อมูลทั้งหมดเก็บใน **LocalStorage** ของเบราว์เซอร์

![Notes App Screenshot](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ ฟีเจอร์

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 📄 สร้าง / แก้ไข / ลบ | จัดการบันทึกได้ไม่จำกัด |
| 📂 หมวดหมู่ | ทั่วไป, งาน, ส่วนตัว, ไอเดีย, สิ่งที่ต้องทำ |
| 🎨 สีพื้นหลัง | เลือกสีประจำแต่ละบันทึก |
| ✏️ Rich Text Editor | ตัวหนา, ตัวเอียง, ขีดเส้นใต้, รายการ, สีตัวอักษร, ขนาดฟอนต์ |
| 🔍 ค้นหา | ค้นหาจากหัวข้อและเนื้อหา |
| 🗂️ กรองหมวด | แสดงเฉพาะหมวดที่ต้องการ |
| 💾 บันทึกอัตโนมัติ | Auto-save ทุก 600ms หลังพิมพ์ |
| ⬇️ Export JSON | ส่งออกข้อมูลทั้งหมดเป็นไฟล์ `.json` |
| ⬆️ Import JSON | นำเข้าข้อมูลจากไฟล์ backup |
| 📊 นับคำ | แสดงจำนวนตัวอักษรและคำแบบ real-time |

---

## 🚀 วิธีใช้งาน

เปิดไฟล์ `index.html` ในเบราว์เซอร์ได้เลย ไม่ต้องติดตั้ง server หรือ dependencies ใดๆ

```bash
# Clone repository
git clone https://github.com/bfirstkok/NoteApp.git

# เปิดไฟล์
cd NoteApp
start index.html   # Windows
open index.html    # macOS
```

---

## 📁 โครงสร้างโปรเจกต์

```
NoteApp/
├── index.html   # โครงสร้าง UI ทั้งหมด
├── style.css    # สไตล์ชีท (Dark sidebar + Light editor)
├── app.js       # Logic และการจัดการข้อมูล
└── README.md    # ไฟล์นี้
```

---

## 🖥️ เทคโนโลยีที่ใช้

- **HTML5** — โครงสร้างหน้าเว็บ
- **CSS3** — จัดสไตล์ด้วย CSS Variables และ Flexbox
- **Vanilla JavaScript** — Logic ทั้งหมด ไม่พึ่ง Framework
- **LocalStorage** — เก็บข้อมูลในเบราว์เซอร์
- **document.execCommand** — Rich Text Editing

---

## 💾 การ Export / Import

**Export** กดปุ่ม `⬇ Export` เพื่อดาวน์โหลดบันทึกทั้งหมดเป็นไฟล์ `notes_backup_YYYYMMDD.json`

**Import** กดปุ่ม `⬆ Import` แล้วเลือกไฟล์ `.json` ที่ต้องการ — เลือกได้ว่าจะ **รวม** กับข้อมูลเดิม หรือ **แทนที่** ทั้งหมด

---

## 📄 License

MIT License — ใช้งานได้อย่างอิสระ
