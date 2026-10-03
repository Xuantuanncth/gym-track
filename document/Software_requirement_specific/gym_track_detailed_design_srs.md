# GYM TRACK — AI-AGENT EXECUTABLE DESIGN & TECHNICAL SPECIFICATION (Design_SRS.md)

**Version:** 2.2  
**Target Platform:** Expo / React Native (Android-first, web-compatible)  
**Primary Execution Engine:** Expo Router + React Native + AsyncStorage  
**Audience:** AI Coding Assistants (GitHub Copilot and other coding agents)

> **Implementation authority:** This repository is an Expo SDK 57 / React Native application, not a native Kotlin project. Sections 3, 5, and 6 below preserve the original Room/Compose proposal for historical reference only; the current implementation contract and ordered work plan are in Section 7. Do not create Kotlin, Jetpack Compose, Room, Hilt, or Koin files for this repository.

---

## 1. PROJECT SYSTEM PROMPT & TECHNICAL CONSTRAINTS

```yaml
system_instructions:
    project_name: "Gym Track"
    architecture_pattern: "Expo Router + feature-oriented React Native modules"
    ui_framework: "Expo SDK 57 + React Native 0.86"
    persistence: "AsyncStorage, offline-first"
    navigation: "Expo Router tabs"
    concurrency: "React state and asynchronous storage APIs"
  execution_rules:
    - "Offline-First: Absolutely no external HTTP requests, authentication, or network calls."
        - "Keep logged entries as the source of truth; compute totals from entries."
    - "Buffer Clear Side Effect: Assigning reps to a muscle MUST automatically clear the keypad buffer."
        - "Keep the seven SRS v2.0 muscle groups in storage/history; Home exposes the five primary groups in the supplied mockup."
        - "All in-app icon assets belong under assets/icon; preserve app launcher, adaptive icon, and splash assets under assets/images."
```

---

## 2. EXACT MOCKUP UI/UX SPECIFICATIONS

Based on the provided layout design (`Screenshot_20260924_194058_Teams.jpg`), the Home Screen is organized into 3 key functional sections.

```text
┌───────────────────────────────────────────────────────────────┐
│ SECTION 1: TOP DISPLAY & DAILY SUMMARY                        │
│ ┌───────────────┐                                             │
│ │ 💪 (Arm)   30 │                          24-Sep-2026        │
│ │ 🫁 (Chest) 30 │                                             │
│ │ 🦵 (Leg)   30 │                     150                     │
│ │ 🏋️ (Back)  30 │                  (GRAND TOTAL)              │
│ │ 📐 (Shoulder)30│                  Color: #E53935             │
│ └───────────────┘                                             │
├───────────────────────────────────────────────────────────────┤
│ SECTION 2: INPUT & ACTION GRID AREA                           │
│ ┌───┬───┬───┐                         ┌─────────────────┐     │
│ │ 1 │ 2 │ 3 │                         │ 💪  Arm         │     │
│ ├───┼───┼───┤                         ├─────────────────┤     │
│ │ 4 │ 5 │ 6 │                         │ 🫁  Chest       │     │
│ ├───┼───┼───┤                         ├─────────────────┤     │
│ │ 7 │ 8 │ 9 │                         │ 🦵  Leg         │     │
│ ├───┼───┼───┤                         ├─────────────────┤     │
│ │ ✔ │ 0 │ ⌫ │                         │ 🏋️  Back        │     │
│ └───┴───┴───┘                         ├─────────────────┤     │
│                                       │ 📐  Shoulder    │     │
│                                       └─────────────────┘     │
├───────────────────────────────────────────────────────────────┤
│ SECTION 3: BOTTOM NAVIGATION BAR                             │
│     [ 🔲 Dashboard ]       [ 🏠 Home ]      [ 📋 History ]    │
└───────────────────────────────────────────────────────────────┘
```

### 2.1 Section Detailed Specifications

#### Section 1: Daily Summary Header
* **Left Sub-panel (Muscle Progress List):**
  * Vertical `LazyColumn` containing the current session's logged muscle groups.
  * Each item displays the **Muscle Icon Asset** paired with its **Accumulated Reps Count** in bold black text.
* **Right Sub-panel (Date & Grand Total):**
  * **Formatted Date:** Text displaying the current date formatted as `dd-MMM-yyyy` (e.g., `24-Sep-2026`).
  * **Grand Total Reps:** Prominently sized text (Font Size: `48.sp`+, Weight: `Bold`) using hex color `#E53935` (Bright Red). Represents the sum of all entries for the selected day.

#### Section 2: Keypad & Muscle Selector Grid
Divided horizontally into two columns:
* **Left Column (3x4 Keypad Grid):**
  * Buttons `1` through `9`.
  * Bottom row: `✔` (Confirm/Submit), `0`, and `⌫` (Delete/Clear).
  * Display Buffer Area: Displays currently typed digits above keypad or embedded.
* **Right Column (Vertical Muscle Action Buttons):**
  * Vertical stack of 5 primary Muscle Action Buttons:
    1. **Arm** (Cánh tay)
    2. **Chest** (Ngực)
    3. **Leg** (Đùi/Chân)
    4. **Back** (Lưng)
    5. **Shoulder** (Vai)

#### Section 3: Bottom Navigation Bar
3 navigation items with explicit active states:
1. **Dashboard** (`ic_dashboard` / 4-squares grid) -> Navigates to Aggregated Category Metrics.
2. **Home** (`ic_home` / House icon) -> Main Keypad Logging Screen.
3. **History** (`ic_history` / List-document icon) -> Date-wise Workout Logs.

---

## 3. LEGACY ROOM DATABASE PROPOSAL (NOT USED BY THIS APP)

The Kotlin entities and DAO below are retained as historical design material only. The active repository uses `src/data/gym-storage.ts` and AsyncStorage. Do not implement Room or migrate away from AsyncStorage as part of the UI redesign.

### 3.1 Entities

```kotlin
package com.gymtrack.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "muscle_groups")
data class MuscleGroupEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val codeName: String, // "ARM", "CHEST", "LEG", "BACK", "SHOULDER"
    val displayName: String, // "Tay", "Ngực", "Chân", "Lưng", "Vai"
    val iconAsset: String, // Asset path or Vector identifier
    val sortOrder: Int
)

@Entity(tableName = "sessions")
data class SessionEntity(
    @PrimaryKey val id: String, // Format "YYYY-MM-DD" e.g., "2026-09-24"
    val dateFormatted: String, // "24-Sep-2026"
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "entries",
    foreignKeys = [
        ForeignKey(
            entity = SessionEntity::class,
            parentColumns = ["id"],
            childColumns = ["sessionId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = MuscleGroupEntity::class,
            parentColumns = ["id"],
            childColumns = ["muscleGroupId"],
            onDelete = ForeignKey.RESTRICT
        )
    ],
    indices = [Index("sessionId"), Index("muscleGroupId")]
)
data class EntryEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val sessionId: String,
    val muscleGroupId: Int,
    val reps: Int,
    val createdAt: Long = System.currentTimeMillis()
)
```

### 3.2 Data Transfer Objects (DTOs) & DAO

```kotlin
package com.gymtrack.data.local.dto

data class MuscleSummaryDto(
    val muscleGroupId: Int,
    val codeName: String,
    val displayName: String,
    val iconAsset: String,
    val totalReps: Int
)

data class SessionDetailDto(
    val entryId: Int,
    val muscleDisplayName: String,
    val reps: Int,
    val createdAt: Long
)
```

```kotlin
package com.gymtrack.data.local.dao

import androidx.room.*
import com.gymtrack.data.local.dto.MuscleSummaryDto
import com.gymtrack.data.local.dto.SessionDetailDto
import com.gymtrack.data.local.entity.EntryEntity
import com.gymtrack.data.local.entity.MuscleGroupEntity
import com.gymtrack.data.local.entity.SessionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface GymTrackDao {
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertSession(session: SessionEntity)

    @Insert
    suspend fun insertEntry(entry: EntryEntity)

    @Query("""
        SELECT 
            mg.id AS muscleGroupId,
            mg.codeName AS codeName,
            mg.displayName AS displayName,
            mg.iconAsset AS iconAsset,
            COALESCE(SUM(e.reps), 0) AS totalReps
        FROM muscle_groups mg
        LEFT JOIN entries e ON mg.id = e.muscleGroupId AND e.sessionId = :sessionId
        GROUP BY mg.id
        ORDER BY mg.sortOrder ASC
    """)
    fun getDailyMuscleSummary(sessionId: String): Flow<List<MuscleSummaryDto>>

    @Query("SELECT COALESCE(SUM(reps), 0) FROM entries WHERE sessionId = :sessionId")
    fun getGrandTotalReps(sessionId: String): Flow<Int>

    @Query("""
        SELECT e.id AS entryId, mg.displayName AS muscleDisplayName, e.reps, e.createdAt
        FROM entries e
        JOIN muscle_groups mg ON e.muscleGroupId = mg.id
        WHERE e.sessionId = :sessionId
        ORDER BY e.createdAt DESC
    """)
    fun getSessionEntries(sessionId: String): Flow<List<SessionDetailDto>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun seedMuscleGroups(groups: List<MuscleGroupEntity>)
}
```

---

## 4. STATE MACHINE & VIEWMODEL LOGIC

### 4.1 Keypad Input Rules

| Initial Buffer State | Event Triggered | Condition / Constraint | Next Buffer State | Database Action |
| :--- | :--- | :--- | :--- | :--- |
| `""` | `Digit(D)` ($D \in [1..9]$) | None | `"$D"` | None |
| `"12"` | `Digit(D)` | Buffer length $< 3$ | `"12$D"` | None |
| `"999"` | `Digit(D)` | Buffer length $\ge 3$ | `"999"` | None (Trigger Haptic Warning) |
| `Any` | `Delete / ⌫` | Length $> 1$ | Drop last char | None |
| `"5"` | `Delete / ⌫` | Length $= 1$ | `""` | None |
| `Any` | `Long Press Delete` | - | `""` | None |
| `"30"` | `Tap Muscle(M)` | Buffer integer $> 0$ | `""` (Reset) | 1. Ensure `Session` exists<br>2. Insert `Entry(sessionId, M.id, 30)` |
| `""` | `Tap Muscle(M)` | Buffer empty | `""` | Ignore (No Action) |

---

## 5. LEGACY UI IMPLEMENTATION EXAMPLE (JETPACK COMPOSE)

The Compose sample below is not an implementation contract for this repository. The Expo/React Native screen contract is defined in Section 7.

```kotlin
package com.gymtrack.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToDashboard: () -> Unit,
    onNavigateToHistory: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        bottomBar = {
            GymTrackBottomBar(
                currentRoute = "home",
                onDashboardClick = onNavigateToDashboard,
                onHomeClick = {},
                onHistoryClick = onNavigateToHistory
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color.White)
                .padding(16.dp)
        ) {
            // SECTION 1: TOP DISPLAY & DAILY SUMMARY
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Left Panel: Active Muscles & Reps
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(uiState.muscleSummaries) { item ->
                        MuscleSummaryRow(
                            iconAsset = item.iconAsset,
                            reps = item.totalReps
                        )
                    }
                }

                // Right Panel: Date & Big Red Grand Total
                Column(
                    horizontalAlignment = Alignment.End,
                    verticalArrangement = Arrangement.Top,
                    modifier = Modifier.padding(start = 16.dp)
                ) {
                    Text(
                        text = uiState.currentDateFormatted, // "24-Sep-2026"
                        style = MaterialTheme.typography.titleMedium,
                        color = Color.DarkGray
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "${uiState.grandTotalReps}",
                        fontSize = 54.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFFE53935) // Design Red
                    )
                }
            }

            Divider(modifier = Modifier.padding(vertical = 12.dp), color = Color.LightGray)

            // SECTION 2: KEYPAD & MUSCLE SELECTOR
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .wrapContentHeight(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Keypad Grid (3x4)
                NumericKeypad(
                    modifier = Modifier.weight(3f),
                    currentBuffer = uiState.inputBuffer,
                    onDigitClick = viewModel::onDigitClicked,
                    onDeleteClick = viewModel::onDeleteClicked,
                    onConfirmClick = viewModel::onConfirmClicked
                )

                // Muscle Selection Action Buttons (Vertical Column)
                MuscleActionColumn(
                    modifier = Modifier.weight(1.2f),
                    muscles = uiState.muscleSummaries,
                    onMuscleClick = viewModel::onMuscleSelected
                )
            }
        }
    }
}
```

---

## 6. LEGACY ANDROID IMPLEMENTATION TASK LIST

These unchecked Kotlin tasks are superseded by the Expo implementation roadmap in Section 7.

- [ ] **Task 1: Room DB & Seeding**
  - Create Room entities, DAOs, and database class.
  - Implement automatic database seeding on launch to insert default muscle groups:
    - `1 | ARM | Tay | ic_arm | 1`
    - `2 | CHEST | Ngực | ic_chest | 2`
    - `3 | LEG | Chân | ic_leg | 3`
    - `4 | BACK | Lưng | ic_back | 4`
    - `5 | SHOULDER | Vai | ic_shoulder | 5`

- [ ] **Task 2: Repository & Use Cases**
  - Implement `GymRepository` providing reactive `Flow` mappings from Room DAO.
  - Implement `AddEntryUseCase`: Ensures current date session exists, logs `EntryEntity`, and computes dynamic updates.

- [ ] **Task 3: ViewModel Input Management**
  - Implement `HomeViewModel` with state management for `inputBuffer` (Max 3 digits).
  - Bind `onMuscleSelected(muscleId)` to commit entry and auto-clear `inputBuffer`.

- [ ] **Task 4: Jetpack Compose Layout Assembly**
  - Build exact UI according to `Screenshot_20260924_194058_Teams.jpg`.
  - Apply styling: Text color `#E53935` for Grand Total, distinct 3x4 Keypad grid, vertical Muscle Action bar, and Bottom Navigation.

---

## 7. CURRENT EXPO IMPLEMENTATION CONTRACT AND TRACKING

### 7.1 Current Screen Design

Home follows the supplied three-section mockup:

1. **Daily summary:** accumulated reps by muscle with local icon assets on the left; current date formatted `dd-MMM-yyyy` and daily grand total in `#E53935` on the right.
2. **Entry controls:** current numeric buffer, 3-by-4 keypad, and five vertical primary actions in this order: Arm, Chest, Leg, Back, Shoulder. Tapping a muscle with a positive buffer creates one immutable entry and clears the buffer. Long-pressing backspace clears the full buffer. The check key marks the buffer ready; muscle selection performs the entry write.
3. **Bottom navigation:** Dashboard, Home, History. Dashboard shows all-time reps, training-day count, entry count, and reps by muscle. History retains entries for all seven SRS v2.0 muscle groups, including Triceps and Other.

The screen remains responsive on narrow devices and web. Do not force the three-column ASCII proportions onto small screens; keep the keypad and muscle actions usable without horizontal scrolling.

### 7.2 Assets and Data

- UI muscle and tab images live under `assets/icon/muscles/` and `assets/icon/tabs/`.
- `assets/images/icon.png`, Android adaptive icon images, and splash assets are app-branding assets and stay in place.
- Entries are stored offline in AsyncStorage by `src/data/gym-storage.ts`; daily and all-time totals are derived from entries, not persisted separately.
- No network, account, authentication, or cloud sync is in scope.

### 7.3 Implementation Status

- [x] Daily keypad input, max 999 reps, backspace, and entry buffer reset.
- [x] Daily summary and red grand total arranged to match the mockup.
- [x] Five ordered primary muscle actions with local icon assets.
- [x] Dashboard, Home, and History navigation destinations on native and web.
- [x] All-time summary metrics on Dashboard.
- [x] History and storage retain the seven default muscle groups.
- [x] UI icon assets moved into `assets/icon/`.
- [ ] Add dedicated shoulder/back/leg tab and muscle artwork where current assets do not match the group.
- [ ] Validate the layout on Android device sizes and web responsive breakpoints.
- [ ] Add focused tests for keypad boundaries, entry persistence, daily totals, and history ordering.
- [ ] Decide whether users need a direct UI action to assign Triceps and Other; they remain available in history/data but are not primary Home actions.
- [ ] Add weekly statistics and muscle history charts.

### 7.4 Change Log

| Action | Item | Tracking note |
| --- | --- | --- |
| Modified | Home layout | Replaced stacked keypad/muscle cards with summary header and side-by-side keypad/action columns. |
| Modified | Keypad | Replaced `C` key with confirm; long-press backspace clears the full buffer. |
| Added | Dashboard | Added all-time total reps, training days, entry count, and per-muscle totals. |
| Added | Navigation | Added Dashboard tab to native and web tab bars; removed web starter branding/docs link. |
| Moved | Muscle icons | `assets/images/icon/*` to `assets/icon/muscles/*`. |
| Moved | Tab icons | `assets/images/tabIcons/*` to `assets/icon/tabs/*`. |
| Preserved | App branding | `assets/images/icon.png` and splash/adaptive icons were not moved. |
| Deferred | Analytics | Weekly and muscle-history charts remain planned, not implemented. |