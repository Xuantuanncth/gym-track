# GYM TRACK — Software Requirements Specification (SRS)

**Version:** 1.0 — MVP  
**Ngày:** 23/09/2026  
**Nền tảng mục tiêu:** Android trước; có thể mở rộng iOS/Web  
**Framework:** Expo + React Native + TypeScript  
**Routing:** Expo Router  
**Database MVP:** SQLite local  
**Project hiện tại:** `gym-track`

## 1. Mục đích

Gym Track là ứng dụng theo dõi tập gym cá nhân, tập trung vào việc **ghi
số rep cực nhanh trong lúc đang tập** và biến dữ liệu đó thành thống kê
dễ hiểu theo ngày, bài tập và nhóm cơ.

Vòng lặp cốt lõi:

**Chọn bài → nhập rep → app tự tính tổng → hoàn thành workout → xem lịch
sử → xem tiến bộ.**

Nguyên tắc UX cao nhất:

> Ghi một set phải nhanh, ít thao tác và không làm gián đoạn buổi tập.

## 2. Bối cảnh

Người dùng thường không muốn mở bàn phím Android, điền nhiều form hoặc
xác nhận nhiều lần sau mỗi set. Gym Track sử dụng **numeric keypad
chuyên dụng**:

``` text
1  2  3
4  5  6
7  8  9
   0
```

Ví dụ một bài:

``` text
Incline Bench

Set 1     20
Set 2     30
Set 3     30
Set 4     20

TOTAL    100 REPS
```

App phải ưu tiên tốc độ nhập liệu hơn số lượng tính năng.

## 3. Phạm vi MVP

### 3.1 Có trong MVP

- Muscle groups.
- Exercises.
- Gán exercise vào muscle group.
- Tạo workout hôm nay.
- Chọn exercise cho workout.
- Tạo và quản lý set.
- Numeric keypad nhập rep.
- Undo / backspace / clear.
- Auto-advance sang set tiếp theo.
- Add set.
- Sửa và xóa set.
- Tổng rep theo exercise.
- Tổng rep theo workout.
- Tổng rep theo muscle group.
- History.
- Workout detail.
- Daily statistics.
- Exercise statistics.
- Muscle-group statistics.
- Biểu đồ xu hướng.
- Local persistence.
- Offline-first.

### 3.2 Không thuộc MVP

- Login/account.
- Cloud sync.
- Social/community.
- AI coach.
- Nutrition/calories/macros.
- Subscription/ads.
- GPS.
- Wearables.
- Apple Health / Health Connect.
- Video hướng dẫn.
- Body-progress photos.
- Automatic exercise recognition.

Weight tracking, volume kg, PR và estimated 1RM được **chuẩn bị ở data
model nhưng không bắt buộc ở MVP**.

## 4. Người dùng mục tiêu

MVP dành cho một người dùng cá nhân:

- tập gym thường xuyên;
- muốn ghi số rep sau mỗi set;
- muốn xem tiến bộ;
- không muốn nhập nhiều dữ liệu trong phòng gym;
- cần app hoạt động khi mất Internet.

## 5. Nguyên tắc thiết kế

### 5.1 Rep-first

Rep là dữ liệu trung tâm.

### 5.2 Local-first

Workout phải ghi/đọc được khi offline.

### 5.3 Zero unnecessary input

Thông tin app đã biết phải tự xử lý: ngày hiện tại, exercise, muscle
group, workout và set đang active.

### 5.4 One-hand friendly

Các nút chính phải dễ bấm bằng một tay.

### 5.5 Fast interaction

Không mở keyboard hệ thống cho việc nhập rep.

### 5.6 Data integrity

Đã lưu thì không được mất dữ liệu do đóng app hoặc restart.

## 6. Technical architecture

Project đã được tạo và chạy thành công bằng:

``` bash
npx create-expo-app@latest gym-track
cd gym-track
npx expo start
```

Expo hiện dùng template mặc định cho app mới; template này bao gồm Expo
Router và TypeScript. Expo Router là file-based router.
citeturn0search2turn0search8

Cài SQLite:

``` bash
npx expo install expo-sqlite
```

`expo-sqlite` cung cấp SQLite API và database được persist qua các lần
restart app. citeturn0search1

Kiến trúc:

``` text
Screens / UI
     ↓
Hooks / Application Services
     ↓
Repositories
     ↓
SQLite
```

UI không nên query SQLite trực tiếp ở mọi component.

## 7. Screen map

``` text
Today
├── Start / Continue Workout
├── Exercise Selection
└── Active Workout

History
└── Workout Detail

Statistics
├── Daily
├── Exercise
└── Muscle Group

Settings
└── Exercise Management
```

Đề xuất Expo Router:

``` text
app/
├── _layout.tsx
├── index.tsx
├── workout/
│   ├── index.tsx
│   ├── select-exercise.tsx
│   └── [id].tsx
├── history/
│   ├── index.tsx
│   └── [id].tsx
├── stats/
│   ├── index.tsx
│   ├── exercises.tsx
│   └── muscles.tsx
└── settings/
    ├── index.tsx
    └── exercises.tsx
```

## 8. Database model

### 8.1 MuscleGroup

``` text
id
name
icon
sort_order
created_at
updated_at
```

Seed mặc định:

``` text
Chest
Back
Shoulders
Arms
Legs
Core
```

### 8.2 Exercise

``` text
id
name
muscle_group_id
icon
default_sets
is_active
created_at
updated_at
```

Ví dụ:

``` text
Incline Bench Press → Chest
Lateral Raise       → Shoulders
Lat Pulldown        → Back
Squat               → Legs
```

### 8.3 Workout

``` text
id
workout_date
started_at
finished_at
status
notes
created_at
updated_at
```

Status:

``` text
active
completed
cancelled
```

### 8.4 WorkoutExercise

``` text
id
workout_id
exercise_id
sort_order
created_at
```

### 8.5 Set

``` text
id
workout_exercise_id
set_number
reps
weight
completed
created_at
updated_at
```

`weight` nullable để dành cho phiên bản sau.

## 9. Quan hệ

``` text
MuscleGroup 1 ─── N Exercise

Workout 1 ─── N WorkoutExercise

Exercise 1 ─── N WorkoutExercise

WorkoutExercise 1 ─── N Set
```

Bật:

``` sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
```

Expo khuyến nghị WAL để cải thiện hiệu năng tổng thể SQLite.
citeturn0search1

## 10. Functional Requirements

### FR-001 — First launch

Khi mở app lần đầu:

1.  Khởi tạo database.
2.  Chạy migration.
3.  Seed muscle groups.
4.  Seed exercise mẫu nếu cần.
5.  Hiển thị Today.

**Acceptance:** app không crash và dữ liệu vẫn tồn tại sau restart.

### FR-002 — Today

Hiển thị:

``` text
GYM TRACK
23/09/2026

Chest

Incline Bench
Lateral Raise
Cable Fly

[ START WORKOUT ]
```

Nếu có workout active:

``` text
[ CONTINUE WORKOUT ]
```

### FR-003 — Start workout

Tạo workout:

``` text
workout_date = local date
status = active
```

Không tạo duplicate workout active trong cùng ngày ở MVP.

### FR-004 — Exercise selection

Cho phép:

- tìm kiếm;
- chọn exercise;
- xem muscle group;
- thay đổi thứ tự.

### FR-005 — Active workout

Đây là màn hình quan trọng nhất.

Ví dụ:

``` text
Incline Bench
Chest

● 20
○ 30
○ 30
○ 20

TOTAL
100 REPS
```

Set đang active phải nổi bật rõ ràng.

### FR-006 — Numeric keypad

Keypad:

``` text
1  2  3
4  5  6
7  8  9
   0
```

Control phụ:

``` text
Backspace
Clear
Undo
Add Set
Complete
```

### FR-007 — Input reps

Bấm:

``` text
2 → 0
```

kết quả:

``` text
20
```

Không mở keyboard Android.

### FR-008 — Validation

`reps` là integer:

``` text
0..999
```

Không chấp nhận số âm, số thập phân hoặc text.

### FR-009 — Backspace/Clear

Ví dụ:

``` text
120 → 12 → 1
```

Clear đưa input về empty.

### FR-010 — Undo

Undo phải hoàn tác thao tác nhập gần nhất, không ảnh hưởng các set khác.

### FR-011 — Auto advance

Sau khi complete set:

``` text
Set 1 → Set 2 → Set 3 → ...
```

Set tiếp theo tự được chọn.

### FR-012 — Add set

`+ SET` tạo set tiếp theo và focus vào set đó.

### FR-013 — Delete set

Cho phép xóa set. UI numbering nên normalize sau khi xóa.

### FR-014 — Exercise total

Công thức:

``` text
exerciseTotal = Σ completedSet.reps
```

Ví dụ:

``` text
20 + 30 + 30 + 20 = 100
```

### FR-015 — Workout total

``` text
workoutTotal = Σ exerciseTotal
```

### FR-016 — Muscle total

Các exercise thuộc cùng muscle group được cộng lại.

Ví dụ:

``` text
Incline Bench = 100
Cable Fly     = 80

Chest = 180 reps
```

### FR-017 — Finish workout

Khi Finish:

1.  Hiển thị summary.
2.  Cho phép workout có set chưa hoàn thành.
3.  User xác nhận.
4.  status → completed.
5.  finished_at được ghi.

Summary:

``` text
WORKOUT COMPLETE

Chest        180
Back         120
Shoulders     60

TOTAL        360 REPS
```

### FR-018 — History

Sắp xếp workout mới nhất trước.

Ví dụ:

``` text
23/09  Chest / Back     360 reps
21/09  Legs             420 reps
19/09  Chest             310 reps
```

### FR-019 — Workout detail

Hiển thị toàn bộ exercise, set, reps và total của workout.

### FR-020 — Daily statistics

Tổng rep theo ngày.

Ví dụ:

``` text
10/12  100
11/12  120
12/12  180
```

### FR-021 — Exercise statistics

Ví dụ:

``` text
Incline Bench

10/09   80
12/09   90
15/09  100
18/09  110
```

### FR-022 — Muscle-group statistics

Ví dụ:

``` text
CHEST

10/09  180
12/09  220
15/09  200
18/09  260
```

### FR-023 — Exercise management

Cho phép add/edit/deactivate exercise.

Không hard-delete exercise đã xuất hiện trong history.

### FR-024 — Local persistence

Sau force close/restart:

- workout;
- exercises;
- sets;
- history;

phải còn nguyên.

## 11. Statistics definitions

### Daily Total Reps

``` text
Σ completed set reps on a date
```

### Exercise Total Reps

``` text
Σ completed set reps for exercise in period
```

### Muscle Group Total Reps

``` text
Σ completed set reps of exercises in muscle group
```

### Workout Total Reps

``` text
Σ all completed set reps in workout
```

## 12. Charts

MVP cần:

1.  Daily reps chart.
2.  Exercise progress chart.
3.  Muscle-group progress chart.

Có thể dùng bar chart cho daily và line chart cho trend.

Chart phải:

- có axis;
- có ngày;
- có value;
- phân biệt rõ reps với weight/volume;
- xử lý 0, 1 hoặc 2 data points;
- có empty state.

Không có dữ liệu:

``` text
No data yet.
Complete a workout to see your progress.
```

## 13. Weight extension

Database phải lưu được:

``` text
weight REAL NULL
```

Ví dụ:

``` text
reps = 10
weight = 60
```

hoặc:

``` text
reps = 10
weight = null
```

Sau này có thể tính:

``` text
setVolume = weight × reps
```

Ví dụ:

``` text
60×10
60×10
65×8

Volume = 1720 kg
```

Không được gọi `1720 kg` là `1720 reps`.

## 14. Future metrics

Sau MVP:

- Volume kg.
- Max weight.
- PR.
- Estimated 1RM.
- Weekly/monthly summaries.
- Weight tracking.
- Rest timer.

## 15. Offline requirements

Tắt Wi-Fi và mobile data vẫn phải:

- start workout;
- chọn exercise;
- nhập rep;
- save set;
- finish workout;
- xem history;
- xem statistics.

Core flow không được phụ thuộc Internet.

## 16. Performance

Mục tiêu:

- keypad phản hồi ngay;
- không lag khi bấm liên tục;
- không network request khi nhập set;
- history vài nghìn set vẫn usable;
- không render lại toàn bộ workout không cần thiết.

## 17. UX

- Touch target đủ lớn.
- Set active dễ nhận biết.
- Completed set có trạng thái rõ.
- Không popup sau mỗi set.
- Không confirmation sau mỗi input.
- Confirmation chỉ cho destructive action hoặc Finish Workout.
- Có thể thao tác bằng một tay.
- Không yêu cầu user nhớ thông tin app đã biết.

## 18. Error handling

Database error phải có thông báo rõ:

``` text
Something went wrong.
Your workout could not be saved.
[ Retry ]
```

Không âm thầm bỏ dữ liệu.

Migration failure phải được phát hiện.

## 19. Project structure

``` text
gym-track/
├── app/
├── components/
│   ├── NumericKeypad.tsx
│   ├── ExerciseCard.tsx
│   ├── SetRow.tsx
│   ├── WorkoutSummary.tsx
│   ├── StatCard.tsx
│   └── ProgressChart.tsx
├── db/
│   ├── database.ts
│   ├── migrations.ts
│   ├── seed.ts
│   └── repositories/
├── domain/
│   ├── workout.ts
│   ├── exercise.ts
│   ├── muscle.ts
│   └── statistics.ts
├── hooks/
├── utils/
├── constants/
└── assets/
```

Business logic không nên nằm trực tiếp trong screen component.

Các hàm nên có:

``` text
calculateExerciseTotalReps()
calculateWorkoutTotalReps()
calculateMuscleGroupTotal()
calculateDailyTotals()
calculateExerciseProgress()
```

## 20. Testing

### Unit tests

- total exercise reps;
- total workout reps;
- muscle aggregation;
- daily aggregation;
- input validation.

Ví dụ:

``` text
[20, 30, 30, 20] → 100
```

### Repository tests

- create workout;
- add exercise;
- add set;
- update set;
- delete set;
- history query.

### Critical UI flow

``` text
Start
→ Select exercise
→ Enter 20
→ Enter 30
→ Enter 30
→ Enter 20
→ Total 100
→ Finish
→ History 100
```

### Device testing

Phải test trên Android thật vì đây là app thao tác trực tiếp bằng ngón
tay trong lúc tập.

## 21. Acceptance Criteria

MVP đạt khi:

1.  First launch tạo database thành công.
2.  Có muscle groups mặc định.
3.  Có thể tạo workout hôm nay.
4.  Có thể chọn exercise.
5.  Có thể tạo nhiều set.
6.  Numeric keypad nhập được reps.
7.  Không mở keyboard hệ thống.
8.  Set complete chuyển sang set tiếp theo.
9.  Total rep tính đúng.
10. Workout total tính đúng.
11. Finish lưu workout.
12. History hiển thị workout.
13. Daily chart hiển thị tổng rep.
14. Muscle chart cộng đúng theo group.
15. Restart app không mất dữ liệu.
16. Offline vẫn chạy core flow.
17. Có thể sửa/xóa set.
18. Không có runtime error trong happy path.

## 22. Development phases

### Phase 1 — Foundation

- Dọn Expo template.
- Giữ Expo Router.
- Cài expo-sqlite.
- Migration.
- Seed data.

### Phase 2 — Core logging

- Today.
- Start workout.
- Exercise selection.
- Active workout.
- Set rows.
- Numeric keypad.
- Persistence.

### Phase 3 — History

- Finish workout.
- History.
- Workout detail.

### Phase 4 — Statistics

- Daily.
- Exercise.
- Muscle group.
- Charts.

### Phase 5 — Polish

- Undo.
- Validation.
- Empty states.
- Error handling.
- Performance.
- Android device testing.

## 23. Vertical slice bắt buộc

Không nên code toàn bộ app cùng lúc.

Vertical slice đầu tiên:

``` text
Start workout
      ↓
Select Incline Bench
      ↓
Set 1 = 20
      ↓
Set 2 = 30
      ↓
Set 3 = 30
      ↓
Set 4 = 20
      ↓
TOTAL = 100
      ↓
Finish
      ↓
History = 100
```

Nếu vertical slice này chạy ổn trên điện thoại thật, architecture đã
chứng minh được ý tưởng.

## 24. Backup / restore

Không bắt buộc MVP.

Nên thiết kế để sau này có:

``` text
Export JSON
Import JSON
CSV export
```

Ví dụ:

``` json
{
  "version": 1,
  "workouts": [],
  "exercises": [],
  "muscleGroups": []
}
```

## 25. Cloud sync

Không implement MVP.

Architecture:

``` text
UI
 ↓
Application service
 ↓
Repository
 ↓
SQLite
```

Sau này:

``` text
SQLite
 ↕
Sync service
 ↕
Cloud
```

## 26. Open decisions

Các vấn đề chưa cần chặn MVP:

1.  Có nhập weight ngay hay chỉ chuẩn bị database?
2.  Một ngày có nhiều workout không?
3.  Rest timer?
4.  Một exercise có nhiều muscle group?
5.  Workout template?
6.  Dark mode?
7.  Custom exercise icon?
8.  Export/import?
9.  Line hay bar chart cho từng statistic?
10. Body weight tracking?

Nếu chưa quyết định, chọn phương án đơn giản nhất.

## 27. Roadmap

### V1.1

- Weight.
- Rest timer.
- PR.
- Estimated 1RM.
- Volume.
- Weekly/monthly summary.

### V1.2

- Workout templates.
- Repeat previous workout.
- Quick start.
- Superset.
- Notes.

### V1.3

- JSON backup.
- CSV export.

### V2

- Cloud sync.
- Multi-device.
- Authentication.

### V3

- AI analysis.
- Workout recommendations.
- Health platform integration.

## 28. Definition of Done

Feature chỉ được coi là Done khi:

1.  Chạy trên Android thật.
2.  Không TypeScript error.
3.  Không runtime error trong happy path.
4.  Persistence hoạt động.
5.  Có empty state.
6.  Có error handling cơ bản.
7.  Không phá feature cũ.
8.  Một tay thao tác được.
9.  Core flow offline.
10. Logic quan trọng có test case.

## 29. Product principle

Gym Track không cố trở thành một fitness platform.

MVP chỉ cần làm thật tốt một việc:

> **Ghi lại buổi tập với tốc độ cao và biến dữ liệu đó thành thông tin
> dễ hiểu về quá trình tập luyện.**

Nếu phải chọn giữa:

``` text
nhiều feature hơn
```

và:

``` text
ghi một set nhanh hơn
```

MVP ưu tiên:

``` text
ghi một set nhanh hơn.
```

## 30. Proposed SQLite schema

``` sql
PRAGMA foreign_keys = ON;

CREATE TABLE muscle_groups (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE exercises (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  muscle_group_id TEXT NOT NULL,
  icon TEXT,
  default_sets INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (muscle_group_id)
    REFERENCES muscle_groups(id)
);

CREATE TABLE workouts (
  id TEXT PRIMARY KEY NOT NULL,
  workout_date TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE workout_exercises (
  id TEXT PRIMARY KEY NOT NULL,
  workout_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (workout_id)
    REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id)
    REFERENCES exercises(id)
);

CREATE TABLE sets (
  id TEXT PRIMARY KEY NOT NULL,
  workout_exercise_id TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight REAL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (workout_exercise_id)
    REFERENCES workout_exercises(id) ON DELETE CASCADE
);

CREATE INDEX idx_workouts_date
  ON workouts(workout_date);

CREATE INDEX idx_sets_workout_exercise
  ON sets(workout_exercise_id);

CREATE INDEX idx_workout_exercises_workout
  ON workout_exercises(workout_id);
```

## 31. Example data flow

``` text
23/09/2026
   ↓
Start workout
   ↓
Select Incline Bench
   ↓
Create WorkoutExercise
   ↓
Create Set 1..4
   ↓
2 → 0 = 20
3 → 0 = 30
3 → 0 = 30
2 → 0 = 20
   ↓
Exercise total = 100
   ↓
Finish workout
   ↓
Workout status = completed
   ↓
History query
   ↓
Statistics aggregation
```

## 32. Final MVP definition

MVP hoàn chỉnh phải cho phép:

``` text
Mở app
   ↓
Start today's workout
   ↓
Chọn bài
   ↓
Nhập rep bằng keypad
   ↓
App tự tính total
   ↓
Chuyển set tiếp theo
   ↓
Chuyển bài tiếp theo
   ↓
Finish
   ↓
History
   ↓
Daily statistics
   ↓
Exercise statistics
   ↓
Muscle-group statistics
```

Khi flow này hoạt động ổn định trên Android thật, Gym Track MVP được coi
là hoàn thành.
