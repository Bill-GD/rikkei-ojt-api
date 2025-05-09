- Các nhánh được bảo vệ: `main`, `dev`
- Khi phát triển một tính năng mới hay sửa lỗi, tạo một nhánh mới từ nhánh `dev` với tiền tố `feature`, `fix`...
- Khi hoàn thành tính năng, tạo pull request (PR)/merge request (MR) đến nhánh
  `dev`, chọn người đánh giá và người được giao.
  Tiêu đề PR/MR phải bao gồm tiền tố thích hợp: `Draft`, `Fix` hoặc tên của chức năng
- Các thành viên liên quan có thể thảo luận về PR/MR và gán task
- Khi PR/MR đã sẵn sàng để đánh giá, bỏ tiền tố `Draft`
- Sau khi merge với nhánh `dev`, sẽ kiểm tra kỹ trước khi merge với nhánh `main`
