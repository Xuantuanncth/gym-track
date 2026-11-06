# Gym Track - Trạng thái triển khai

Tài liệu này đối chiếu SRS v2.0 với ứng dụng Expo hiện tại và bản redesign theo `gym_track_detailed_design_srs.md` v2.2. Checkbox chỉ đánh dấu phần đã có trong code, không đánh dấu phần mới chỉ được thiết kế.

## 1. Home

- [x] Hiển thị ngày hiện tại theo local date của thiết bị.
- [x] Hiển thị tổng số reps trong ngày.
- [x] Hiển thị input hiện tại.
- [x] Numeric keypad gồm các số từ `0` đến `9`.
- [x] Giới hạn input tối đa `999` reps cho mỗi entry.
- [x] Nút `✓` xác nhận buffer sẵn sàng gán muscle.
- [x] Nút backspace để xóa ký tự cuối.
- [x] Nhấn giữ backspace để xóa toàn bộ input.
- [x] Không cho phép tạo entry khi input rỗng hoặc không hợp lệ.
- [x] Hiển thị hướng dẫn trạng thái ngắn gọn cho input.

## 2. Muscle Groups

Data model, Dashboard và History hiện có 7 nhóm cơ theo SRS v2.0:

- [x] Arm
- [x] Shoulder
- [x] Chest
- [x] Back
- [x] Leg
- [x] Triceps
- [x] Other

Mỗi nhóm cơ có:

- [x] Button để gán reps hiện tại.
- [x] Tên nhóm cơ.
- [x] Icon hiển thị.
- [x] Tổng reps của nhóm cơ trong ngày hiện tại.
- [x] Hiệu ứng phản hồi khi nhấn.

## 3. Tạo Entry

- [x] Luồng thao tác nhanh: nhập số reps, chọn nhóm cơ, hoàn tất.
- [x] Mỗi lần chọn nhóm cơ tạo một entry riêng biệt.
- [x] Entry lưu `id`, `date`, `muscleId`, `reps`, và `createdAt`.
- [x] Input được reset ngay sau khi tạo entry thành công.
- [x] Không yêu cầu workout name, exercise, set, weight, notes hoặc confirmation dialog.

## 4. Daily Summary

- [x] Tính tổng reps theo từng nhóm cơ từ danh sách entry gốc.
- [x] Tính tổng reps của toàn bộ ngày.
- [x] Không lưu tổng nhóm cơ như dữ liệu gốc.
- [x] Tổng được tính lại từ các entry riêng biệt.

## 5. Local Persistence

- [x] Lưu dữ liệu offline bằng AsyncStorage.
- [x] Dữ liệu vẫn được đọc lại sau khi app khởi động lại.
- [x] Không yêu cầu account, login, server, Firebase hoặc cloud sync.
- [x] Dùng ngày local của thiết bị để phân biệt các Daily Session.
- [x] Có type model cho `MuscleGroup` và `WorkoutEntry`.

## 6. History

- [x] Hiển thị danh sách các ngày đã có entry.
- [x] Sắp xếp ngày mới nhất trước.
- [x] Hiển thị tổng reps của từng ngày.
- [x] Hiển thị số lượng entry trong từng ngày.
- [x] Hiển thị summary theo nhóm cơ cho từng ngày.
- [x] Có thể mở rộng một ngày để xem chi tiết.
- [x] Hiển thị từng entry riêng biệt với reps, nhóm cơ và thời gian tạo.
- [x] Hiển thị empty state khi chưa có session nào.

## 7. Navigation

- [x] Tab Home.
- [x] Tab History.
- [x] Tab Dashboard.
- [x] Hỗ trợ navigation cho native tabs.
- [x] Hỗ trợ navigation cho web tabs.

## 8. UI/UX

- [x] Thiết kế mobile-first.
- [x] Bố cục Home theo mockup: daily summary phía trên, keypad và 5 muscle action theo hai cột.
- [x] Current input hiển thị phẳng phía trên keypad, không dùng card nổi.
- [x] Keypad 3x4 được tăng kích thước; các hàng giãn theo chiều cao màn hình.
- [x] Icon và nút muscle action thu gọn để ưu tiên không gian keypad.
- [x] 5 muscle action chính theo thứ tự Arm, Chest, Leg, Back, Shoulder.
- [x] Ngày hiển thị theo `dd-MMM-yyyy`; total reps dùng cỡ chữ 104px, đệm phải 16px, màu đỏ dưới 500 và xanh lá từ 500.
- [x] Icon muscle lấy từ local assets trong `assets/icon/`.
- [x] Có trạng thái nhấn cho keypad và muscle buttons.
- [x] Có layout giới hạn chiều rộng để hiển thị tốt trên màn hình lớn.
- [x] Có màu sắc riêng cho input panel, tổng reps, keypad và muscle actions.
- [x] Home summary, keypad, muscle actions và total reps đã được người dùng duyệt về giao diện.
- [x] Không dùng popup khi người dùng chọn muscle mà chưa nhập reps.

## 9. Validation đã thực hiện

- [x] TypeScript check sau redesign: `npx tsc --noEmit`
- [x] Expo lint sau redesign: `npx expo lint`
- [ ] Android device/emulator visual check.
- [x] Web phone-size visual check tại viewport 360x800.

## 10. Chưa implement / cần xác định tiếp

Các hạng mục sau chưa được implement hoặc cần quyết định sản phẩm:

- [ ] Weekly statistics và muscle history chart.
- [ ] Quyết định cách tạo entry cho Triceps và Other: hiện có trong dữ liệu/History/Dashboard nhưng không còn nút gán trên Home theo mockup 5 muscle.
- [ ] Thay icon dùng tạm cho Triceps/Other trong tổng hợp bằng asset phù hợp nếu cần.
- [ ] Kiểm tra kích thước nhỏ, tablet và web để xác nhận bố cục hai cột không bị chật.
- [ ] Viết unit tests cho keypad, giới hạn 999, persistence, tổng theo ngày và sắp xếp History.
- [ ] Custom muscle groups.
- [ ] Exercise database.
- [ ] Weight tracking.
- [ ] Set tracking.
- [ ] Rest timer.
- [ ] Workout templates.
- [ ] Calories và nutrition tracking.
- [ ] Goals.
- [ ] Account và authentication.
- [ ] Cloud sync.
- [ ] Social features.

## 11. Nhật ký thay đổi để tracking

| Loại | Hạng mục | Ghi chú |
| --- | --- | --- |
| Sửa | Home | Đổi sang bố cục daily summary + keypad/muscle actions theo design; chuẩn hóa format ngày và màu grand total. |
| Sửa | Home mobile spacing | Chuyển current input xuống dưới total bên phải, tăng diện tích keypad, thu icon muscle và bỏ bottom padding thừa. |
| Sửa | Keypad | Đổi `C` thành `✓`; long-press backspace xóa toàn buffer. |
| Thêm | Dashboard | Hiển thị tổng reps all-time, số ngày tập, số entry và tổng theo từng muscle. |
| Thêm | Navigation | Thêm Dashboard vào native/web; bỏ branding và link Docs mặc định của Expo Starter ở tab web. |
| Di chuyển | Muscle icons | `assets/images/icon/*` -> `assets/icon/muscles/*`. |
| Di chuyển | Tab icons | `assets/images/tabIcons/*` -> `assets/icon/tabs/*`. |
| Giữ nguyên | App branding assets | `assets/images/icon.png`, adaptive icons và splash icons không di chuyển. |
| Trì hoãn | Analytics mở rộng | Weekly charts và muscle history charts chưa triển khai. |
| Trì hoãn/chờ quyết định | Triceps và Other | Giữ nguyên log cũ và số liệu, nhưng mockup mới chỉ có 5 action chính trên Home. |

## 12. Source chính

- [Home screen](src/app/index.tsx)
- [History screen](src/app/explore.tsx)
- [Storage và data model](src/data/gym-storage.ts)
- [Theme](src/constants/theme.ts)
- [Native tabs](src/components/app-tabs.tsx)
- [Web tabs](src/components/app-tabs.web.tsx)
- [SRS v2.0](document/Software_requirement_specific/Gym_Track_SRS_v2.0.md)
- [Design SRS v2.2](document/Software_requirement_specific/gym_track_detailed_design_srs.md)

## 13. UX update
"Please update the UI layout to precisely match the expected design (shown in the second image) with the following adjustments:

Top Section Layout & Alignment:

Place the 5 muscle group icons and their corresponding number values vertically on the left side (compact icon followed right next to the number text like [Icon] 30).

Position the date (DD-MMM-YYYY) on the top right, and directly below it, display the Total Reps number in large bold red font (e.g., 150). Remove the floating black card (CURRENT INPUT) currently overlaying on the right.

Keypad & Muscle Selector Layout:

Change the keypad style from rounded gray cards into a clean grid layout separated by thin borders or a clean calculator-like keypad (columns [1, 2, 3], [4, 5, 6], [7, 8, 9], [Check, 0, Delete]).

The right column of the keypad section must contain the 5 vertical muscle group selection buttons as shown in the expected design (icons only or small vertical card list).

Bottom Navigation Bar:

Replace the current rounded pill-shaped bottom nav with the clean flat icon-based navigation bar (Grid/Dashboard icon, Home icon, and List/History icon) matching the expected layout."

### Kế hoạch implement UX-13

- [x] Cập nhật Home: giữ 5 summary nhóm cơ ở trái; đặt ngày và tổng reps đỏ ở phải; bỏ card CURRENT INPUT nhưng vẫn hiển thị buffer nhập rõ ràng, không tạo card nổi.
- [x] Đổi keypad thành lưới phím phân tách bằng viền mảnh; giữ 5 nút chọn muscle xếp dọc bên phải và bảo toàn luồng nhập/lưu hiện tại.
- [x] Đổi web bottom navigation sang thanh phẳng có icon Dashboard, Home và History; làm phẳng native tab indicator và giữ routing.
- [x] Chạy lint và TypeScript check; kiểm tra web ở 360x800 và thao tác nhập/xóa.
- **Trạng thái:** Đã implement; lint, TypeScript và web preview đạt.

## 14. UI UX update part 2

I am building a React Native / Expo app optimized for a Samsung Galaxy S10 5G (6.7-inch screen, 1440x3040 resolution, 19:9 aspect ratio). Please fix and refine the layout based on the latest screenshot to perfectly match the expected design with the following detailed adjustments:

1. Top-Left Muscle Group Rep Counters:
- Increase the font size and make the rep numbers (e.g., 0) for each of the 5 muscle groups (Arm, Chest, Leg, Back, Shoulder) bold, prominent, and visually well-balanced.
- Ensure the muscle icons and their corresponding number text are cleanly aligned (compact icon next to or above the number) with proper padding so they don't look too small or cramped.
- Balance the spacing of this top-left section so it aligns harmoniously with the large "TOTAL REPS" display on the top-right.

2. Keypad & Right-Side Muscle Selector Height Alignment:
- Force the total height of the 3x4 keypad container (rows: 1-3, 4-6, 7-9, and Check-0-Delete) to match exactly the total height of the 5 vertical muscle selector buttons on the right.
- Remove any uneven vertical gaps, awkward margins, or flex mismatches inside the keypad rows so the keypad elements fill their container uniformly and cleanly without stretching past the bottom.
- Structure the 5 muscle selector items on the right as a tightly-spaced vertical list that stretches evenly alongside the keypad height.

3. Cleanup & UI Polish:
- Remove any floating settings buttons (like the floating blue gear icon) or overlapping absolute elements that interfere with the layout flow.
- Ensure all margins, paddings, and proportions are tightly adapted to the Samsung S10 5G screen constraints.

### Kế hoạch implement UX part 2

- [x] Tăng cỡ icon và số reps của 5 nhóm cơ; căn giữa theo chiều dọc với vùng Total Reps.
- [x] Đưa readout input ra ngoài action grid; làm keypad 3x4 và danh sách 5 muscle cùng chiếm đúng một chiều cao, chia hàng đều, không có khoảng hở hoặc tràn.
- [x] Kiểm tra màn hình Home không có nút settings nổi; không sửa component animation/navigation không liên quan.
- [x] Kiểm tra ở web viewport 360x800 và chạy lint cùng TypeScript.
- **Trạng thái:** Đã implement và được người dùng duyệt; kiểm tra Android theo UI-02.

## 15. Update UI UX part 3

The layout still feels unbalanced: the keypad section is too tall/large, and the top section (muscle rep counters and total reps) takes up too little space. Please fix the proportions based on the latest screenshot for a Samsung S10 5G display:

1. Rebalance Vertical Space & Proportions:
- Reduce the overall height of the keypad container and its individual rows so it doesn't dominate the screen. The keypad and the 5 muscle selector buttons on the right should be more compact and neatly anchored toward the lower half.
- Increase the visual weight, spacing, and vertical breathing room of the top section (both the 5 individual muscle rep rows on the top-left and the large "TOTAL REPS" red counter on the top-right) so the top and bottom halves look harmoniously balanced.

2. Keypad Row & Button Sizing:
- Adjust the padding and height inside the 3x4 keypad rows (1-3, 4-6, 7-9, Check-0-Delete) to be moderately sized instead of overly stretched vertically.
- Ensure the right-side muscle selector buttons (Arm, Chest, Leg, Back, Shoulder) match the exact height of the keypad block cleanly without leaving awkward empty gaps.

3. Fix Misplaced Elements:
- Ensure the "0" input preview or prompt text above the keypad is neatly positioned without awkward floating spacing.

### Kế hoạch implement UX part 3

- [x] Tăng chiều cao và khoảng cách của summary để top section cân đối hơn với keypad.
- [x] Giảm chiều cao action grid theo viewport; giữ 12 phím chia đều và 5 muscle buttons bằng đúng chiều cao keypad.
- [x] Căn readout gần action grid, không để số 0 trôi giữa các phần.
- [x] Kiểm tra viewport 360x800 và màn hình thấp; chạy lint và TypeScript.
- **Trạng thái:** Đã implement; lint, TypeScript và web preview đạt. Cần xác minh riêng trên Android.

## Backlog implement để review trước

> Trạng thái ban đầu của tất cả ticket: **Chờ review**. Chưa bắt đầu sửa code các mục bên dưới cho đến khi thống nhất thứ tự/phạm vi. Các mã `UI-*`, `UX-*`, `TEST-*`, `FUTURE-*` dùng để theo dõi từng phần trong những lượt làm tiếp theo.

### P0 - Độ chính xác giao diện và kiểm tra trên Android

#### UI-01 - Neo web tab bar xuống đáy

- **Hiện trạng:** Ảnh preview web đang hiển thị Dashboard/Home/History trên đỉnh màn hình; thanh tab absolute không có vị trí đáy rõ ràng và có thể che phần đầu Home.
- **Phạm vi:** Chỉnh container trong `src/components/app-tabs.web.tsx`; bảo đảm nội dung tab có khoảng trống tương ứng, không bị thanh tab che. Không thay đổi cách hoạt động của native tabs trên Android.
- **Nghiệm thu:** Ở viewport 360x800 và màn hình desktop, thanh tab nằm ở cạnh dưới; Home summary không bị che; tab đang chọn được nhận diện rõ; cuộn History không phủ nội dung quan trọng dưới tab bar.
- **Phụ thuộc:** Không.
- **Trạng thái:** Đã implement; chờ xác minh trực quan trên web.

#### UI-02 - Xác nhận giao diện trên Android thật/emulator

- **Hiện trạng:** Các capture trước là web preview kích thước điện thoại, chưa phải Android; không dùng ảnh web để kết luận về NativeTabs, safe area hoặc status bar Android.
- **Phạm vi:** Chạy app trên ít nhất một emulator/device Android ở kích thước phổ biến; chụp Home, Dashboard và History; kiểm tra safe area, tab bar native, font scale và touch.
- **Nghiệm thu:** Không có header hoặc keypad bị che; native bottom tabs nằm dưới nội dung; Home hiển thị đủ 5 summary rows, 12 keypad keys và 5 muscle actions; không có tràn ngang; thao tác chạm từng nút hoạt động.
- **Phụ thuộc:** Có Android emulator hoặc thiết bị kết nối.
- **Trạng thái:** Chờ review.

#### UI-03 - Cân lại khoảng trống dọc trên Home

- **Hiện trạng:** Home dùng chiều cao action theo `windowHeight`; keypad và muscle actions có chiều cao bằng nhau. Người dùng đã duyệt giao diện Home.
- **Phạm vi:** Hoàn tất cân chỉnh Home; kiểm tra device-native tiếp tục riêng trong UI-02.
- **Nghiệm thu:** Web preview xác nhận keypad và action list đồng chiều cao, mọi phím/nút truy cập được; thiết kế Home được người dùng chấp thuận.
- **Phụ thuộc:** UI-02.
- **Trạng thái:** Done; Android device check được theo dõi riêng ở UI-02.

#### UI-04 - Hoàn thiện kích thước và hierarchy của Home

- **Hiện trạng:** UX-13 bỏ card Current Input; Home dùng readout phẳng, total 104px có padding phải và đổi đỏ/xanh theo ngưỡng 500. Người dùng đã duyệt giao diện.
- **Phạm vi:** Hoàn thiện hierarchy Home; kiểm tra Android-native tiếp tục riêng trong UI-02.
- **Nghiệm thu:** Readout phía trên keypad; total 104px, đỏ dưới 500 và xanh lá từ 500; keypad 3x4; 5 muscle action đúng thứ tự.
- **Phụ thuộc:** UI-02, UI-03.
- **Trạng thái:** Done; Android device check được theo dõi riêng ở UI-02.

### P1 - Chốt tương tác và asset

#### UX-01 - Chốt ý nghĩa phím xác nhận `✓`

- **Hiện trạng:** `✓` hiện chỉ đổi hint thành “Ready to assign”; nó không lưu entry và cũng không bắt buộc trước khi chọn muscle. Design gọi phím là Confirm/Submit nhưng state machine quy định chọn muscle là thao tác commit.
- **Phạm vi:** Chọn và ghi rõ một hành vi duy nhất. Đề xuất mặc định để giữ luồng Zero Ceremony: `✓` xác nhận buffer/hiển thị trạng thái, chọn muscle vẫn ghi entry; hoặc nếu muốn xác nhận bắt buộc thì chỉ cho chọn muscle ghi entry sau khi buffer đã confirm. Không để phím xác nhận là affordance gây hiểu nhầm.
- **Nghiệm thu:** UI hint, accessibility label và state flow mô tả cùng một hành vi; test xác nhận `✓` không tạo entry ngoài ý muốn, chọn muscle chỉ tạo đúng một entry, buffer được reset sau khi lưu thành công.
- **Phụ thuộc:** Cần review hành vi trước khi implement.
- **Trạng thái:** Chờ review quyết định.

#### ASSET-01 - Kiểm kê và hoàn thiện icon nhóm cơ

- **Hiện trạng:** Home đang map Arm->`bicep.png`, Chest->`front.png`, Back->`back.png`, Shoulder->`shoulder.png`, Leg->`gym.png`; hiện chưa có file tên leg chuyên biệt. Một số asset có thể không mô tả đúng nhóm cơ khi thu nhỏ.
- **Phạm vi:** Xem trực tiếp toàn bộ asset trong `assets/icon/muscles/`, lập bảng mapping duy nhất cho Home/Dashboard/History; thêm hoặc thay icon Leg nếu `gym.png` không phù hợp. Không di chuyển icon app launcher/splash khỏi `assets/images/`.
- **Nghiệm thu:** Năm nhóm chính có icon dễ phân biệt và đúng nhãn; mọi UI icon image được tham chiếu từ `assets/icon/`; không có require trỏ tới đường dẫn cũ hoặc asset bị thiếu.
- **Phụ thuộc:** Không.
- **Trạng thái:** Chờ review.

#### UX-02 - Xác định khả năng ghi Triceps và Other

- **Hiện trạng:** Hai nhóm này được giữ trong storage, Dashboard và History nhưng không có action trên Home theo mockup 5 nhóm.
- **Phạm vi:** Quyết định giữ chúng chỉ cho dữ liệu cũ/thống kê, thêm chúng vào một menu mở rộng, hay mở rộng danh sách nút Home. Không xóa hoặc đổi ID để tránh làm mất liên kết dữ liệu đã lưu.
- **Nghiệm thu:** Quyết định được ghi trong design và UI không có nhóm cơ hiển thị nhưng không thể ghi, trừ khi đó là chủ ý được ghi rõ.
- **Phụ thuộc:** Cần review sản phẩm.
- **Trạng thái:** Chờ review quyết định.

#### UX-03 - Đồng nhất biểu tượng navigation

- **Hiện trạng:** Web đã có icon Dashboard dạng grid, Home/History dùng local assets; native dùng icon Dashboard Material/SF và Home/History local assets.
- **Phạm vi:** Giữ icon nhận biết tương ứng, trạng thái selected/unselected và tên truy cập trên cả native lẫn web.
- **Nghiệm thu:** Cả ba tab có biểu tượng nhận biết nhất quán trên Android và web; trạng thái active rõ; không dùng URL/network cho icon.
- **Phụ thuộc:** Không, có thể ghép cùng UI-01.
- **Trạng thái:** Đã implement; web preview xác nhận icon và trạng thái active.

### P1 - Chất lượng và kiểm chứng

#### TEST-01 - Unit test cho input keypad

- **Phạm vi:** Tách phần xử lý keypad thành logic có thể kiểm thử; bao gồm nhập 0-9, bỏ số 0 đầu, tối đa 3 chữ số/999, backspace từng ký tự, long-press clear, xác nhận buffer và input rỗng.
- **Nghiệm thu:** Test bao phủ giới hạn 0/1/999/1000, không vượt quá 3 chữ số, backspace và xác nhận đúng theo quyết định UX-01; chạy được bằng lệnh test được thêm vào package scripts.
- **Phụ thuộc:** UX-01 để cố định hành vi confirm.
- **Trạng thái:** Chờ review.

#### TEST-02 - Test lưu entry và tính tổng

- **Phạm vi:** Kiểm thử `addEntry`, load lại AsyncStorage, tổng theo ngày/nhóm cơ, tổng Dashboard và dữ liệu lỗi/empty.
- **Nghiệm thu:** Entry mới còn sau khi load lại; tổng ngày không lẫn ngày khác; nhiều entry cùng muscle được cộng đúng; nhóm không có entry cho tổng 0; dữ liệu lỗi không làm crash màn hình.
- **Phụ thuộc:** Không.
- **Trạng thái:** Chờ review.

#### TEST-03 - Test History và kiểm tra responsive đa kích thước

- **Phạm vi:** Test ngày mới nhất trước, summary và chi tiết entry; kiểm tra layout Home ở 360x640, 360x800, 412x915, tablet và web desktop; thử font scale lớn.
- **Nghiệm thu:** Thứ tự và chi tiết History đúng; Home không tràn ngang hoặc che nút; nếu phải cuộn thì scroll đến được hàng cuối và tab bar không che nội dung.
- **Phụ thuộc:** UI-01 đến UI-04.
- **Trạng thái:** Chờ review.

#### QA-01 - Xác minh luồng entry đầu cuối

- **Phạm vi:** Trên Android, nhập reps, chọn muscle, xác nhận cập nhật summary/total, chuyển sang History, đóng/mở lại app và kiểm tra dữ liệu.
- **Nghiệm thu:** Một lần chọn muscle tạo đúng một entry; input tự xóa khi lưu thành công; total và muscle summary cập nhật; dữ liệu vẫn tồn tại sau khi khởi động lại; không phát sinh entry khi buffer rỗng/không hợp lệ.
- **Phụ thuộc:** UI-02 và UX-01.
- **Trạng thái:** Chờ review.

### P2 - Mở rộng sau khi MVP ổn định

#### FUTURE-01 - Weekly statistics

- **Phạm vi:** Tổng reps theo tuần, nhóm cơ và khoảng thời gian; quy định ngày bắt đầu tuần theo locale hoặc một quy tắc cố định.
- **Nghiệm thu:** Tổng được tính từ entry gốc; đổi tuần cập nhật đúng; empty state hoạt động; không cần mạng.
- **Phụ thuộc:** TEST-02; cần thống nhất quy tắc tuần.
- **Trạng thái:** Chờ review, chưa thuộc đợt UI hiện tại.

#### FUTURE-02 - Muscle history chart

- **Phạm vi:** Biểu đồ reps theo ngày cho từng nhóm cơ, có empty state và chọn nhóm cơ/khoảng ngày.
- **Nghiệm thu:** Số liệu biểu đồ khớp History; hoạt động offline; nhãn/trục đọc được ở màn hình nhỏ; không thêm chart dependency trước khi chốt thư viện phù hợp Expo SDK.
- **Phụ thuộc:** FUTURE-01 và lựa chọn thư viện sau khi kiểm tra tương thích SDK.
- **Trạng thái:** Chờ review, chưa thuộc đợt UI hiện tại.

### Đề xuất thứ tự thực hiện sau review

1. UI-01 để sửa điều thấy ngay trong web capture.
2. UI-02 để lấy bằng chứng từ Android thật/emulator.
3. UX-01 và UX-02 để khóa hành vi trước khi viết test.
4. ASSET-01 và UX-03 để hoàn thiện hình ảnh/điều hướng.
5. UI-03 và UI-04 để chốt tỷ lệ dựa trên Android capture.
6. TEST-01, TEST-02, TEST-03 và QA-01 để khóa chất lượng MVP.
7. FUTURE-01, FUTURE-02 chỉ thực hiện sau khi MVP được duyệt ổn định.

### Nhật ký thay đổi tài liệu

| Loại | Hạng mục | Ghi chú |
| --- | --- | --- |
| Thêm | Backlog implement | Bổ sung ticket P0/P1/P2 có scope, tiêu chí nghiệm thu, phụ thuộc và trạng thái review; chưa thay đổi code ứng dụng. |
| Implement | UI-01 | Neo web tab bar xuống đáy và thêm vùng đệm cuộn cho Home, Dashboard, History; chưa xác minh trực quan do Node.js hiện tại không tương thích Expo SDK 57. |
| Implement | UX-13 | Sắp lại Home summary, readout và keypad; làm phẳng keypad và bottom navigation native/web. TypeScript, lint, web 360x800 và thao tác nhập/xóa đạt; giao diện Home được người dùng duyệt. |
| Implement | UX part 2 | Tăng cỡ summary, đồng bộ chiều cao keypad/muscle list và co action area theo viewport. TypeScript, lint và web 360x800 đạt; giao diện Home được người dùng duyệt. |
| Implement | UX part 3 | Cân lại chiều cao summary/action và đặt input readout gần keypad. TypeScript, lint, web viewport và cuộn màn hình thấp đạt; giao diện Home được người dùng duyệt. |
| Điều chỉnh | UX part 3 | Thu summary xuống 164dp và input readout còn 36dp để giảm khoảng cách từ header đến keypad theo phản hồi giao diện. |
| Duyệt | Home UI | Người dùng xác nhận giao diện Home hoàn tất; UI-03/UI-04 đánh dấu done. Android device/emulator check vẫn mở tại UI-02. |
