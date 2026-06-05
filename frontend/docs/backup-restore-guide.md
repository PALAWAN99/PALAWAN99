# Backup and Restore Guide (คู่มือการสำรองและกู้คืนข้อมูล)

ระบบ QR Gate Access ใช้ฐานข้อมูล PostgreSQL สำหรับเก็บข้อมูลสมาชิกและเหตุการณ์ทั้งหมด ดังนั้นการสำรองข้อมูลจึงมีความสำคัญสูงสุด

## 1. การสำรองข้อมูล (Backup)

### กรณีใช้งานผ่าน Docker (แนะนำ)
รันคำสั่งนี้เพื่อดัมพ์ข้อมูลจาก Container ลงมาเป็นไฟล์ `.sql`:
```powershell
# สำหรับ PowerShell (Windows)
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
docker exec qrgat-db pg_dump -U postgres qrgat_db > "backups/backup_$Timestamp.sql"
```

### กรณีใช้งานผ่าน Local PostgreSQL
ใช้สคริปต์ที่เตรียมไว้ให้:
```powershell
.\scripts\db-backup.ps1
```

---

## 2. การกู้คืนข้อมูล (Restore)

### กรณีใช้งานผ่าน Docker
1. ตรวจสอบว่า Container `qrgat-db` กำลังทำงานอยู่
2. รันคำสั่งเพื่อกู้คืนไฟล์ (แทนที่ `FILENAME.sql` ด้วยชื่อไฟล์สำรอง):
```powershell
# ล้างข้อมูลเก่าและสร้าง DB ใหม่
docker exec -it qrgat-db dropdb -U postgres qrgat_db
docker exec -it qrgat-db createdb -U postgres qrgat_db

# กู้คืนจากไฟล์
cat backups/FILENAME.sql | docker exec -i qrgat-db psql -U postgres -d qrgat_db
```

### กรณีใช้งานผ่าน Local PostgreSQL
```bash
psql -U postgres -d qrgat_db < backups/FILENAME.sql
```

---

## 3. การสำรองรูปภาพสมาชิก (Storage Backup)
นอกจากฐานข้อมูลแล้ว อย่าลืมสำรองโฟลเดอร์รูปภาพ:
- **Path:** `./storage/members`
- ให้ทำการคัดลอกโฟลเดอร์นี้เก็บไว้พร้อมกับไฟล์ `.sql` ทุกครั้ง

---

## 4. ข้อแนะนำ (Best Practices)
- **Schedule:** ควรตั้งค่า Task Scheduler ใน Windows เพื่อรันสคริปต์สำรองข้อมูลทุกวันเวลา 00:00 น.
- **Off-site Backup:** ควรอัปโหลดไฟล์สำรองขึ้น Google Drive หรือ External HDD เป็นประจำ
- **Retention:** ควรเก็บไฟล์สำรองย้อนหลังอย่างน้อย 30 วัน
