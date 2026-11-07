# 📁 Smart File Organizer — Android

A modern Android application built with Kotlin and Jetpack Compose for intelligent file sorting, duplicate detection, photo organization, and complete batch undo management.

- **Prebuilt APK**: `SmartOrganizer_Android.apk` (12.1 MB)
- **Tech Stack**: Kotlin, Jetpack Compose, Material 3, Android Architecture Components

---

## 🌟 Core Engines & Architecture

The application is structured into specialized processing engines:

1. **`OrganizerEngine.kt`**:
   - Classifies storage files into semantic categories (Documents, Images, Audio, Video, Archives, Code, etc.).
   - Executes safe background file movements with conflict avoidance.

2. **`DuplicateRadarEngine.kt`**:
   - Real-time duplicate scanning using file size checks and cryptographic hashing.
   - Highlights wasted storage and allows 1-tap deduplication.

3. **`VisualPhotoEngine.kt`**:
   - Analyzes camera images, WhatsApp photos, screenshots, and downloaded media.
   - Groups photos intelligently by date, origin, and resolution.

4. **`HistoryManager.kt`**:
   - Records all file movement operations in a persistent journal.
   - Provides 1-tap Undo/Rollback to restore files to their exact original paths.

---

## 📁 Project Structure

```
03-Smart-Organizer-Android/
├── SmartOrganizer_Android.apk  # Prebuilt installable APK
├── build.gradle.kts            # Project-level Gradle build configuration
├── settings.gradle.kts         # Module settings & repository definitions
├── gradlew.bat                 # Windows Gradle wrapper
├── gradle/                     # Version catalog (libs.versions.toml) & wrapper jar
└── app/                        # Android application module
    ├── build.gradle.kts        # App dependencies & SDK configuration
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml
        │   └── java/com/example/smartfileorganizer/
        │       ├── MainActivity.kt
        │       ├── ui/         # Jetpack Compose UI screens & ViewModels
        │       ├── engine/     # Organizer, Duplicate Radar, History & Photo engines
        │       └── theme/      # Dark/Light theme colors & typography
        └── test/               # Unit test suite
```

---

## 🛠️ Building with Android Studio

1. Open **Android Studio**.
2. Select **Open** and navigate to this folder:
   `C:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files\03-Smart-Organizer-Android`
3. Wait for Gradle sync to complete.
4. Run or build the APK:
   ```powershell
   .\gradlew.bat assembleDebug
   ```