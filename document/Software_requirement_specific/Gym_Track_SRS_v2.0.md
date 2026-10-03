# GYM TRACK — Software Requirements Specification

**Version:** 2.0
**Platform:** Android
**Product type:** Personal workout volume tracker
**Core concept:** Numeric Input → Muscle Group → Entry → Daily Session → Statistics

---

# 1. Product Overview

Gym Track là ứng dụng Android cá nhân dùng để ghi nhận nhanh số repetitions (reps) đã thực hiện cho từng nhóm cơ trong một ngày tập.

Ứng dụng **không quản lý bài tập cụ thể**, **không yêu cầu người dùng tạo workout**, **không quản lý set**, **không yêu cầu nhập weight** và **không yêu cầu người dùng ghi dữ liệu trong lúc đang tập**.

Người dùng có thể tập theo bất kỳ hình thức nào, bao gồm:

* Superset
* Circuit
* Compound exercise
* Isolation exercise
* Các bài tập kết hợp nhiều nhóm cơ
* Các buổi tập không có cấu trúc cố định

Sau khi tập xong, người dùng mở ứng dụng và nhập nhanh số reps đã thực hiện cho từng nhóm cơ.

Ví dụ:

```text
10 → TAY
10 → VAI
12 → LƯNG
10 → TAY
15 → VAI
```

Ứng dụng lưu từng lần nhập thành một `Entry` và tự động tổng hợp:

```text
TAY       20
VAI       25
LƯNG      12
```

---

# 2. Product Philosophy

## 2.1. Zero Ceremony

Người dùng không phải thực hiện các bước:

```text
Create Workout
    ↓
Select Exercise
    ↓
Add Set
    ↓
Enter Weight
    ↓
Enter Reps
    ↓
Save
```

Thay vào đó:

```text
Open App
    ↓
Enter Number
    ↓
Tap Muscle
    ↓
Done
```

Mục tiêu là mỗi entry có thể được ghi nhận trong khoảng 1–2 giây.

---

# 3. Terminology

Ứng dụng sử dụng các khái niệm sau.

## 3.1. Muscle Group

Nhóm cơ mà người dùng muốn theo dõi.

MVP mặc định:

* Arm
* Shoulder
* Chest
* Back
* Leg
* Triceps
* Other

Tên hiển thị có thể sử dụng tiếng Việt:

* Tay
* Vai
* Ngực
* Lưng
* Chân
* Tay sau
* Khác

Danh sách này cần được thiết kế để có thể mở rộng trong tương lai.

---

## 3.2. Entry

Một lần người dùng nhập số reps và gán số reps đó cho một nhóm cơ.

Ví dụ:

```text
10 → Tay
```

là một Entry.

Nếu người dùng thực hiện:

```text
10 → Tay
10 → Tay
15 → Tay
```

ứng dụng lưu **3 Entry riêng biệt**, không gộp ngay thành một giá trị duy nhất.

Database:

```text
Entry 1
muscle = Arm
reps = 10

Entry 2
muscle = Arm
reps = 10

Entry 3
muscle = Arm
reps = 15
```

Tổng được tính khi hiển thị:

```text
Arm = 35
```

---

## 3.3. Daily Session

Tất cả Entry của cùng một ngày thuộc về một Daily Session.

Ví dụ:

```text
2026-09-23
```

có:

```text
10 → Arm
10 → Shoulder
12 → Back
10 → Arm
15 → Shoulder
```

Daily Session này có tổng:

```text
Arm       20
Shoulder  25
Back      12
TOTAL     57
```

Người dùng không cần tạo Session thủ công.

Session được xác định tự động dựa trên ngày.

---

# 4. Core User Flow

## 4.1. Opening App

Khi mở app, người dùng nhìn thấy màn hình Home của ngày hiện tại.

Ví dụ:

```text
23 SEP 2026

              0

       Current Input


  1     2     3

  4     5     6

  7     8     9

        0


 ARM      SHOULDER      CHEST

  0           0           0

 BACK       LEG          TRICEPS

  0           0           0
```

---

# 5. Numeric Input

Home screen có numeric keypad.

Người dùng bấm các chữ số để tạo giá trị.

Ví dụ:

```text
1
0
```

Input trở thành:

```text
10
```

Người dùng có thể nhập:

```text
1 → 2 → 0
```

để tạo:

```text
120
```

## 5.1. Input Rules

* Chỉ cho phép số nguyên dương.
* Không cho phép số âm.
* Không cần decimal.
* Không cần đơn vị.
* Input tối đa cần được giới hạn để tránh dữ liệu bất thường.
* MVP có thể giới hạn tối đa 999 reps cho một Entry.

## 5.2. Clear

Có nút `C` hoặc `Clear` để xóa giá trị hiện tại.

Ví dụ:

```text
120
 ↓
Clear
 ↓
0
```

## 5.3. Backspace

Có thể hỗ trợ nút backspace.

Ví dụ:

```text
120
 ↓
Backspace
 ↓
12
```

---

# 6. Assign Reps To Muscle

Sau khi nhập số, người dùng chọn nhóm cơ.

Ví dụ:

```text
10
```

sau đó:

```text
TAY
```

Ứng dụng thực hiện:

```text
Create Entry
----------------
session = 2026-09-23
muscle = Arm
reps = 10
```

Sau đó input được reset:

```text
10
 ↓
TAY
 ↓
[empty]
```

Người dùng có thể nhập entry tiếp theo ngay lập tức.

---

# 7. Muscle Button Behaviour

Mỗi nhóm cơ được hiển thị dưới dạng một button.

Ví dụ:

```text
┌────────────┐
│     💪     │
│    TAY     │
│     60     │
└────────────┘
```

Con số `60` là tổng reps của nhóm cơ đó trong ngày hiện tại.

Khi người dùng nhập:

```text
10
```

và bấm `TAY`:

```text
TAY: 50 → 60
```

Sau đó input reset.

---

# 8. Invalid Action

Nếu người dùng chưa nhập số nhưng bấm nhóm cơ:

```text
[empty]
   ↓
TAY
```

ứng dụng không tạo Entry.

Có thể:

* không phản ứng, hoặc
* hiển thị trạng thái nhẹ như `Enter reps first`.

MVP ưu tiên **không popup**, tránh làm chậm thao tác.

---

# 9. Daily Summary

Home screen phải luôn hiển thị tổng reps của từng nhóm cơ trong ngày.

Ví dụ:

```text
TODAY

TAY       60
VAI       40
LƯNG      50
NGỰC      30
CHÂN      20
TAY SAU   10

----------------

TOTAL    210
```

TOTAL là tổng tất cả Entry trong ngày.

Công thức:

```text
TOTAL =
Arm
+ Shoulder
+ Chest
+ Back
+ Leg
+ Triceps
+ Other
```

---

# 10. Entry History

Ứng dụng phải lưu lịch sử từng Entry.

Ví dụ:

```text
23/09/2026

10  → Tay
10  → Vai
12  → Lưng
10  → Tay
15  → Vai
20  → Lưng
```

History không được chỉ lưu tổng.

Mục đích của việc lưu Entry riêng biệt là để có thể mở rộng chức năng thống kê sau này.

---

# 11. Daily History

Người dùng có thể xem các ngày trước.

Ví dụ:

```text
September 2026

23 Sep
Tay       60
Vai       40
Lưng      50
Total    150

21 Sep
Tay       40
Vai       30
Lưng      60
Total    130

20 Sep
Chân      80
Ngực      40
Total    120
```

Mỗi ngày có thể được mở để xem chi tiết.

---

# 12. Daily Detail

Khi chọn một ngày:

```text
23 September 2026

SUMMARY

Tay       60
Vai       40
Lưng      50
Ngực      30

TOTAL    180
```

Bên dưới có thể hiển thị Entry:

```text
ENTRIES

10 → Tay
10 → Vai
12 → Lưng
10 → Tay
15 → Vai
28 → Lưng
30 → Ngực
```

---

# 13. Statistics

Statistics không phải chức năng cốt lõi của MVP nhưng database phải được thiết kế để hỗ trợ.

Các thống kê dự kiến:

## 13.1. Daily

```text
23 Sep

Tay       60
Vai       40
Lưng      50
Total    150
```

## 13.2. Weekly

```text
This Week

Tay       240
Vai       180
Lưng      210
Ngực      150
Chân      100
```

## 13.3. Muscle History

Ví dụ:

```text
TAY

18 Sep    40
19 Sep    60
21 Sep    80
23 Sep    60
```

Sau này có thể hiển thị chart.

---

# 14. Data Model

MVP sử dụng 3 entity chính.

```text
MuscleGroup
     │
     │
     ▼
Session
     │
     │
     ▼
Entry
```

---

## 14.1. MuscleGroup

```text
MuscleGroup
-----------
id
name
icon
sortOrder
isActive
```

Ví dụ:

```text
1 | Arm       | 💪 | 1 | true
2 | Shoulder  | 🏋 | 2 | true
3 | Chest     | ...| 3 | true
```

---

## 14.2. Session

```text
Session
-------
id
date
createdAt
updatedAt
```

`date` là ngày workout.

Ví dụ:

```text
id = 20260923
date = 2026-09-23
```

Mỗi ngày chỉ có tối đa một Session.

---

## 14.3. Entry

```text
Entry
-----
id
sessionId
muscleGroupId
reps
createdAt
```

Ví dụ:

```text
id = 101
sessionId = 20260923
muscleGroupId = 1
reps = 10
createdAt = ...
```

---

# 15. Data Relationship

```text
Session
   │
   ├── Entry
   │      └── MuscleGroup
   │
   ├── Entry
   │      └── MuscleGroup
   │
   └── Entry
          └── MuscleGroup
```

Ví dụ:

```text
Session: 23/09

Entry #1
10 → Arm

Entry #2
10 → Shoulder

Entry #3
12 → Back

Entry #4
10 → Arm
```

Query tổng:

```text
SUM(entries.reps)
GROUP BY muscleGroupId
```

Kết quả:

```text
Arm       20
Shoulder  10
Back      12
```

---

# 16. Important Data Principle

Không lưu tổng trực tiếp như:

```text
Arm = 60
```

làm dữ liệu gốc.

Dữ liệu gốc phải là:

```text
10 → Arm
10 → Arm
15 → Arm
25 → Arm
```

Tổng `60` được tính từ Entry.

Lý do:

* Không mất lịch sử.
* Có thể sửa/xóa Entry.
* Có thể xây Statistics.
* Có thể phân tích frequency.
* Có thể thay đổi cách tính Statistics mà không mất dữ liệu.
* Có thể mở rộng app sau này.

---

# 17. Persistence

Dữ liệu phải được lưu local trên thiết bị.

MVP không yêu cầu:

* Account
* Login
* Cloud Sync
* Firebase
* Server
* Internet

App phải hoạt động hoàn toàn offline.

---

# 18. App Navigation

MVP chỉ cần 3 khu vực chính:

```text
HOME
  │
  ├── TODAY
  │
  └── input + muscle buttons


HISTORY
  │
  └── previous sessions


STATISTICS
  │
  └── aggregated data
```

Có thể sử dụng bottom navigation:

```text
┌─────────────────────────────────┐
│                                 │
│          Current Screen         │
│                                 │
├─────────────────────────────────┤
│   HOME       HISTORY      STATS │
└─────────────────────────────────┘
```

Nếu muốn MVP cực kỳ đơn giản, `Statistics` có thể chưa xuất hiện ở phiên bản đầu.

---

# 19. MVP Scope

Phiên bản đầu tiên chỉ cần:

### Home

* Hiển thị ngày hiện tại.
* Numeric keypad.
* Input display.
* Muscle buttons.
* Tổng reps của từng nhóm cơ.
* Total reps.

### Data

* Session.
* Entry.
* MuscleGroup.
* Local persistence.

### History

* Danh sách ngày đã tập.
* Xem tổng từng nhóm cơ.
* Xem Entry của một ngày.

Không bao gồm:

* Exercise database.
* Weight tracking.
* Set tracking.
* Rest timer.
* Workout templates.
* Calories.
* AI.
* Social.
* Cloud sync.
* Account.
* Authentication.

---

# 20. UX Requirements

## 20.1. Speed

Thao tác phổ biến:

```text
10 → TAY
```

phải yêu cầu tối đa:

```text
2 digit taps
+
1 muscle tap
```

Không có confirmation dialog.

---

## 20.2. No Unnecessary Forms

Không yêu cầu:

```text
Workout name
Exercise name
Set number
Weight
Rep type
Duration
Notes
```

trong MVP.

---

## 20.3. Immediate Feedback

Sau khi:

```text
10 → TAY
```

UI lập tức thay đổi:

```text
TAY
50 → 60
```

và input trở về trạng thái rỗng.

Người dùng phải nhìn thấy kết quả ngay.

---

# 21. Error Handling

## Empty Input

```text
TAY
```

khi chưa nhập reps:

→ Không tạo Entry.

## Invalid Number

Không cho phép:

```text
-10
1.5
abc
```

## Very Large Number

Giới hạn input ở MVP:

```text
1–999
```

## App Closed Unexpectedly

Các Entry đã được lưu phải vẫn tồn tại.

Ứng dụng không được chỉ lưu dữ liệu trong memory.

---

# 22. Date Handling

Session được xác định theo ngày local của thiết bị.

Ví dụ:

```text
23/09/2026 23:59
```

và:

```text
24/09/2026 00:01
```

thuộc hai Session khác nhau.

MVP sử dụng timezone local của thiết bị.

---

# 23. Future Features

Các tính năng dưới đây **không implement trong MVP**, nhưng architecture không được cản trở việc bổ sung chúng.

### Custom Muscle Groups

Người dùng có thể thêm:

```text
Forearm
Calf
Abs
Glutes
...
```

### Exercise Tracking

Có thể bổ sung:

```text
Exercise
```

nhưng Entry hiện tại vẫn tồn tại.

Ví dụ:

```text
10 → Arm
```

sau này có thể trở thành:

```text
10 → Arm
Exercise = Dumbbell Curl
```

mà không phá vỡ hệ thống hiện tại.

### Weight

Có thể bổ sung:

```text
weight = 10kg
```

### Body Weight

Theo dõi cân nặng.

### Charts

Ví dụ:

```text
Arm Volume

      ●
   ●     ●
 ●         ●
────────────────
```

### Goals

Ví dụ:

```text
Weekly Goal

Arm
240 / 300 reps
```

### Cloud Sync

Có thể đồng bộ dữ liệu giữa nhiều thiết bị trong tương lai.

---

# 24. Non-Goals

Gym Track không cố trở thành một full-featured fitness platform.

MVP không nhằm:

* hướng dẫn người dùng tập bài nào;
* xây dựng workout;
* thay thế personal trainer;
* theo dõi kỹ thuật bài tập;
* theo dõi calorie;
* quản lý dinh dưỡng;
* quản lý progression theo weight;
* social fitness.

Ứng dụng tập trung vào một nhiệm vụ:

> **Cho phép người dùng ghi lại thật nhanh số reps đã thực hiện cho từng nhóm cơ và xem lại khối lượng tập theo thời gian.**

---

# 25. Example Complete Flow

Người dùng tập xong.

Mở app:

```text
23 SEP

Input
[    ]

TAY       0
VAI       0
LƯNG      0
NGỰC      0
CHÂN      0
TAY SAU   0
```

Nhập:

```text
1
0
TAY
```

UI:

```text
TAY       10
```

Nhập:

```text
1
0
VAI
```

UI:

```text
TAY       10
VAI       10
```

Nhập:

```text
1
2
LƯNG
```

UI:

```text
TAY       10
VAI       10
LƯNG      12
```

Nhập tiếp:

```text
1
0
TAY
```

UI:

```text
TAY       20
VAI       10
LƯNG      12
```

Cuối cùng:

```text
TOTAL = 42
```

Database:

```text
Session
2026-09-23

Entries

10 → Arm
10 → Shoulder
12 → Back
10 → Arm
```

---

# 26. Acceptance Criteria

MVP được xem là đạt yêu cầu khi:

1. Người dùng mở app và ngay lập tức có thể nhập reps.
2. Người dùng có thể nhập số bằng numeric keypad.
3. Người dùng có thể chọn một nhóm cơ.
4. Mỗi lần chọn nhóm cơ tạo ra một Entry mới.
5. Input tự động reset sau khi Entry được tạo.
6. Tổng reps của nhóm cơ được cập nhật ngay.
7. Total reps trong ngày được cập nhật ngay.
8. Dữ liệu vẫn tồn tại sau khi đóng/mở app.
9. Người dùng có thể xem các ngày trước.
10. Người dùng có thể xem các Entry của một ngày.
11. Không cần tạo workout thủ công.
12. Không cần chọn exercise.
13. Không cần tạo set.
14. Không cần nhập weight.
15. App hoạt động offline.

---

# 27. Development Priority

Thứ tự implementation đề xuất:

```text
Phase 1
App Shell
    ↓
Home UI
    ↓
Numeric Input
    ↓
Muscle Buttons
    ↓
Entry creation
    ↓
Daily aggregation

Phase 2
Local database
    ↓
Session persistence
    ↓
Entry persistence
    ↓
App restart recovery

Phase 3
History
    ↓
Daily detail

Phase 4
Statistics
    ↓
Weekly aggregation
    ↓
Muscle history
```

Không implement Statistics trước khi core interaction hoạt động ổn định.

---

# 28. Core Product Definition

Nếu phải mô tả toàn bộ sản phẩm bằng một câu:

> **Gym Track là một bộ đếm reps theo nhóm cơ, có lưu lịch sử theo ngày.**

Interaction cốt lõi:

```text
NUMBER
   ↓
MUSCLE
   ↓
ENTRY
   ↓
DAILY TOTAL
   ↓
HISTORY
```

Đây là nền tảng của toàn bộ architecture và UX của ứng dụng.
