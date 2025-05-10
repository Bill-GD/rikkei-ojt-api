- Các nhánh chính được bảo vệ: `main`, `dev`
- TÍnh năng:
  - Khi phát triển một tính năng mới hay sửa lỗi, tạo một nhánh mới từ nhánh `dev` với tiền tố như `feature`,
    `fix`...
  - Khi hoàn thành tính năng, tạo merge request (MR) đến nhánh `dev`, chọn người đánh giá, nhãn.
    Tiêu đề MR phải bao gồm tiền tố thích hợp: `Fix` hoặc tên của chức năng
- Merge request:
  - Đánh dấu `Draft` được GitLab hỗ trợ (chưa hoàn thiện)
  - Nếu cần thay đổi, commit tiếp vào nhánh đó, MR sẽ tự động cập nhật
  - Các thành viên liên quan có thể thảo luận về MR, thay đổi
  - Khi MR đã hoàn thiện, bỏ tiền tố `Draft` (`Markk as ready`), hoàn thiện tất cả các thảo luận
- Merging:
  - Sau khi merge với nhánh `dev`, sẽ kiểm tra kỹ trước khi merge với nhánh `main`
  - Merge theo phương thức fast-forward, rebase nếu cần, các commit sẽ được squash
