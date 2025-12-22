# HUSC-DKTC-TOOL

**HUSC-DKTC-TOOL** là tiện ích mở rộng (Extension) dành cho trình duyệt, được thiết kế đặc biệt để hỗ trợ sinh viên Đại học Khoa học Huế (HUSC) trong việc đăng ký tín chỉ. Công cụ giúp tối ưu hóa thao tác, hỗ trợ mở nhiều tab cùng lúc và tự động duy trì kết nối.

## 🚀 Tính năng nổi bật

* **Đa luồng (Multi-Tab):** Săn nhiều học phần cùng một lúc trên một giao diện duy nhất.
* **Chế độ Bong bóng (Bubble Mode):** Thu nhỏ tool thành icon trôi nổi để không che khuất màn hình.
* **Tự động lưu trạng thái:** Giữ nguyên danh sách lớp và trạng thái khi bạn tải lại trang (F5) hoặc lỡ tắt trình duyệt.
* **Auto-Retry & Login:** Tự động thử lại khi mạng lag, web lỗi, 404, 302,... và hỗ trợ đăng nhập lại ngay trong tool khi hết phiên đăng nhập mà không cần phải load giao diện đăng nhập (hữu ích trong mùa đăng ký tín chỉ, load trang đăng nhập cũng là 1 điều khó khăn).
* **An toàn:** Chạy trực tiếp trên trình duyệt của bạn, không gửi dữ liệu đi đâu khác.

---

## 📂 Cấu trúc thư mục

Đảm bảo thư mục sau khi tải về có cấu trúc như sau:

```text
husc-dktc-tool/
├── manifest.json   # Cấu hình chính của Extension
├── content.js      # Mã nguồn xử lý chính (Core logic)
├── icon.png        # Icon hiển thị (Logo)
└── README.md       # File hướng dẫn này

```

---

## 📥 Hướng dẫn Cài đặt

Bạn cần cài đặt thủ công theo chế độ **Developer Mode**. Hỗ trợ: Chrome, Edge, Cốc Cốc, Brave, Opera.

### Cách 1: Tải file ZIP (Dành cho người dùng phổ thông)

1. Truy cập vào [trang GitHub của dự án](https://github.com/nhathuynguyen19/husc-dktc-tool.git).
2. Bấm vào nút **Code** màu xanh -> Chọn **Download ZIP**.
3. Giải nén file `.zip` vừa tải về ra một thư mục. **Lưu ý:** Hãy để thư mục ở nơi an toàn, không được xóa sau khi cài.

### Cách 2: Dùng Git Clone (Dành cho Developer)

Mở Terminal hoặc Git Bash và chạy lệnh:

```bash
git clone https://github.com/nhathuynguyen19/husc-dktc-tool.git

```

---

## 🔧 Cách thêm vào trình duyệt

Sau khi đã có thư mục code trên máy tính, hãy làm theo hướng dẫn cho từng trình duyệt:

### 1️⃣ Google Chrome / Brave

1. Mở trình duyệt, nhập vào thanh địa chỉ: `chrome://extensions/`
2. Nhìn góc trên bên phải, bật công tắc **Developer mode** (Chế độ dành cho nhà phát triển).
3. Xuất hiện 3 nút mới, bấm vào **Load unpacked** (Tải tiện ích đã giải nén).
4. Chọn thư mục bạn vừa giải nén (hoặc clone) ở bước trên.
5. Xong! Extension đã hiện trong danh sách.

### 2️⃣ Microsoft Edge

1. Nhập vào thanh địa chỉ: `edge://extensions/`
2. Cột bên trái, bật công tắc **Developer mode**.
3. Bấm nút **Load unpacked** (Tải phần mở rộng đã giải nén).
4. Chọn thư mục code.

### 3️⃣ Cốc Cốc

1. Nhập vào thanh địa chỉ: `coccoc://extensions/`
2. Bật chế độ **Chế độ dành cho nhà phát triển** (thường ở góc trên cùng).
3. Bấm **Tải tiện ích đã giải nén**.
4. Chọn thư mục code.

---

## 📖 Hướng dẫn sử dụng

1. Truy cập trang đăng ký tín chỉ: [https://student.husc.edu.vn/](https://student.husc.edu.vn/)
2. Đăng nhập vào tài khoản sinh viên của bạn.
3. Tool sẽ **tự động khởi động** ở góc phải màn hình dưới dạng **Bong bóng tròn**.
4. **Thao tác:**
* Bấm vào Bong bóng để mở giao diện chính.
* Bấm dấu **`+`** để thêm Tab mới cho mỗi môn học.
* Nhập **Mã lớp học phần** (Ví dụ: `2025-2026.2.TIN4083.001`) vào ô trống và nhấn Enter.
* Tool sẽ tự động tìm form. Khi thấy form, bong bóng sẽ nhấp nháy đỏ hoặc tab sẽ hiện màu xanh.
* Nhập mã Captcha và bấm **Xác nhận** để đăng ký.



### 💡 Mẹo nhỏ

* **Thu nhỏ:** Bấm nút `_` trên thanh tiêu đề để thu nhỏ tool, giúp bạn làm việc khác trong khi tool vẫn chạy ngầm.
* **Đèn báo:** Nếu bong bóng có số màu đỏ, nghĩa là có tab đã tìm thấy form, hãy mở ra ngay!

---

## ⚠️ Lưu ý & Khuyến cáo

* **Chọn kỳ học phù hợp:** Chọn học kỳ tác nghiệp trước khi thực hiện tìm kiếm và đăng ký.
* **Không tắt trình duyệt:** Tool chỉ hoạt động khi bạn đang mở trang web trường.
* **Kết nối mạng:** Tool phụ thuộc vào tốc độ mạng và phản hồi của server trường.
* **Trách nhiệm:** Tool này chỉ là công cụ hỗ trợ thao tác nhanh hơn, **không đảm bảo 100%** việc đăng ký thành công nếu lớp đã đầy hoặc server trường bị sập. Tôi không chịu trách nhiệm về kết quả đăng ký tín chỉ của bạn.

---

## 🤝 Đóng góp (Contributing)

Mọi đóng góp, báo lỗi hoặc yêu cầu tính năng mới đều được hoan nghênh! Hãy tạo **Issue** hoặc gửi **Pull Request** trên GitHub.

## 📄 License

Dự án được phát hành miễn phí. Nghiêm cấm hành vi thương mại hóa hoặc bán lại công cụ này.