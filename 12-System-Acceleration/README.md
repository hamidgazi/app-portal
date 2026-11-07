# 🚀 System Acceleration & Zero-Lag Optimization Suite
**Tailored for Intel Core i5-7400 • 8 GB RAM • Dual-Drive SSD + 5400 RPM HDD Architecture**

---

## 1. Project Purpose & Executive Overview

This suite provides a comprehensive, hardware-targeted system tuning and latency elimination pipeline engineered specifically for this workstation's hardware profile:
- **Processor**: Intel Core i5-7400 @ 3.00 GHz (4 Cores / 4 Threads)
- **Memory**: 8.0 GB DDR4 RAM
- **Primary Storage**: HS-SSD-C100 (240 GB SATA SSD)
- **Secondary Storage**: WD22PURZ-85B4ZY0 (2 TB Western Digital Purple 5400 RPM HDD)
- **Integrated GPU**: Intel HD Graphics 630

All optimizations are strictly software-based, 100% reversible, and require **zero hardware expense**.

---

## 2. Deliverables Catalog

| Deliverable | Format | Location | Purpose |
| :--- | :--- | :--- | :--- |
| **System Acceleration Launcher** | `.bat` | [`Apply PC Acceleration.bat`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/scripts/Apply_System_Tweaks.ps1) | 1-Click launcher applying system-level service and memory tweaks. |
| **System Rollback Launcher** | `.bat` | [`Rollback PC Acceleration.bat`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/scripts/Rollback_PC_Acceleration.ps1) | 1-Click launcher restoring all Windows default settings, services, and power schemes. |
| **Disable Intel Usage Report** | `.vbs` / `.bat` | [`Disable_Intel_Usage_Report.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Disable_Intel_Usage_Report.vbs) | 1-Click silent launcher disabling Intel SUR and DSA telemetry services, freeing **~585 MB RAM**. |
| **Rollback Intel Usage Report** | `.vbs` / `.bat` | [`Rollback_Intel_Usage_Report.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Rollback_Intel_Usage_Report.vbs) | 1-Click launcher re-enabling Intel SUR and DSA services. |
| **Windows Defender Optimizer** | `.vbs` / `.ps1` | [`Optimize_Windows_Defender.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Optimize_Windows_Defender.vbs) | Silent 1-click launcher taming MsMpEng.exe, capping CPU at 15%, and breaking the self-scan loop. |
| **Windows Defender Rollback** | `.vbs` / `.ps1` | [`Rollback_Windows_Defender.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Rollback_Windows_Defender.vbs) | 1-click launcher restoring default Defender CPU load factors and scanning settings. |
| **Disable Defender Completely** | `.vbs` / `.bat` | [`Disable_Defender_Full.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Disable_Defender_Full.vbs) | Silent 1-click launcher turning off Defender policies and freeing **~336 MB RAM** (0 MB RAM used). |
| **Re-Enable Defender Full** | `.vbs` / `.bat` | [`Enable_Defender_Full.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Enable_Defender_Full.vbs) | 1-click launcher restoring active Defender real-time protection. |
| **Restore App Icons & Pagefile** | `.vbs` / `.bat` | [`Restore_App_Icons.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Restore_App_Icons.vbs) | 1-Click silent launcher repairing corrupted UWP Store app icons (WhatsApp, Telegram, ChatGPT), restoring SSD Pagefile virtual memory, and configuring SearchApp. |
| **Executive Plan Artifact** | `.md` | [`system_acceleration_plan.md`](file:///C:/Users/Shop%20PC%202/.gemini/antigravity/brain/21a33fd0-d74a-484f-98c0-47fef47d0e7f/system_acceleration_plan.md) | Architectural roadmap and telemetry findings. |
| **Registry Snapshots & Backups** | `.reg` / `.lnk` | [`backups/`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/backups/) | Full pre-optimization registry exports and backed up startup shortcuts. |

---

## 3. Annotated Directory Tree

```
Antigravity Files/
└── 07-System-Acceleration/
    ├── README.md                           <-- Master navigation hub & documentation
    ├── Restore_App_Icons.vbs               <-- 1-Click silent launcher repairing broken UWP Store icons & Pagefile
    ├── Restore_App_Icons.bat               <-- Batch wrapper for App Icon & Pagefile restoration
    ├── Disable_Intel_Usage_Report.vbs      <-- 1-Click silent launcher disabling Intel SUR/DSA (Frees ~585 MB RAM)
    ├── Disable_Intel_Usage_Report.bat      <-- Batch wrapper for Intel disabling
    ├── Rollback_Intel_Usage_Report.vbs     <-- 1-Click launcher restoring Intel services
    ├── Rollback_Intel_Usage_Report.bat     <-- Batch wrapper for Intel rollback
    ├── Optimize_Windows_Defender.vbs       <-- Silent 1-Click Defender optimization launcher (0 console windows)
    ├── Optimize_Windows_Defender.bat       <-- Batch wrapper for Defender optimization
    ├── Rollback_Windows_Defender.vbs       <-- Silent 1-Click Defender rollback launcher
    ├── Rollback_Windows_Defender.bat       <-- Batch wrapper for Defender rollback
    ├── Disable_Defender_Full.vbs           <-- 1-Click complete Defender deactivator (Frees ~336 MB RAM)
    ├── Disable_Defender_Full.bat           <-- Batch wrapper for full Defender deactivation
    ├── Enable_Defender_Full.vbs            <-- 1-Click complete Defender reactivator
    ├── Enable_Defender_Full.bat            <-- Batch wrapper for full Defender reactivation
    ├── scripts/
    │   ├── Restore_App_Icons_And_Pagefile.ps1 <-- Automated AppIconCache repair & Pagefile restoration engine
    │   ├── Apply_System_Tweaks.ps1         <-- System-level PowerShell script (Services, Memory, Pagefile)
    │   ├── Rollback_PC_Acceleration.ps1    <-- System rollback script
    │   ├── Optimize_Windows_Defender.ps1   <-- Defender engine optimizer (MsMpEng exclusions, CPU throttling)
    │   ├── Rollback_Windows_Defender.ps1   <-- Defender restoration script
    │   ├── Disable_Intel_Usage_Report.ps1  <-- Intel SUR and DSA disablement script
    │   ├── Rollback_Intel_Usage_Report.ps1 <-- Intel services restoration script
    │   ├── Disable_Windows_Defender_Full.ps1 <-- Defender complete shutdown script
    │   └── Enable_Windows_Defender_Full.ps1  <-- Defender complete restoration script
    └── backups/
        ├── HKCU_ControlPanel_Desktop.reg
        ├── HKCU_Explorer_Advanced.reg
        ├── HKCU_Run.reg
        ├── HKCU_Run_pre_pruning.reg
        ├── HKCU_Themes_Personalize.reg
        ├── HKLM_Memory_Management.reg
        ├── HKLM_Run.reg
        ├── Brother iPSMonitor.lnk          <-- Preserved printer polling startup shortcut
        ├── elevation_log.txt               <-- Execution and telemetry logs
        ├── defender_opt_log.txt            <-- Defender optimization execution log
        ├── intel_opt_log.txt               <-- Intel optimization log
        ├── app_icon_restoration_log.txt    <-- App icon restoration execution log
        └── defender_full_disable_log.txt   <-- Defender full disable log
```

---

## 4. Quick-Start & Maintenance Commands

### Apply System-Level Optimizations (Elevated)
Double-click [`Apply PC Acceleration.bat`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Apply%20PC%20Acceleration.bat) on the Desktop and click **"Yes"** on the Windows UAC prompt.

Or run manually from an Administrator PowerShell prompt:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "c:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files\07-System-Acceleration\scripts\Apply_System_Tweaks.ps1"
```

### Apply Windows Defender & Antimalware Service Optimization (Elevated)
Double-click [`Optimize_Windows_Defender.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Optimize_Windows_Defender.vbs) (or [`Optimize_Windows_Defender.bat`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Optimize_Windows_Defender.bat)) and click **"Yes"** on the Windows UAC prompt.

Or run manually from an Administrator PowerShell prompt:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "c:\Users\Shop PC 2\OneDrive\Desktop\Antigravity Files\07-System-Acceleration\scripts\Optimize_Windows_Defender.ps1"
```

### Disable Intel Usage Report & DSA Telemetry (Reclaim ~585 MB RAM)
Double-click [`Disable_Intel_Usage_Report.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Disable_Intel_Usage_Report.vbs) (or [`Disable_Intel_Usage_Report.bat`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Disable_Intel_Usage_Report.bat)) and click **"Yes"** on the Windows UAC prompt.

### Re-Enable Intel Usage Report & DSA
Double-click [`Rollback_Intel_Usage_Report.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Rollback_Intel_Usage_Report.vbs) and click **"Yes"** on the Windows UAC prompt.

### Completely Disable Windows Defender (Reclaim ~336 MB RAM)
Double-click [`Disable_Defender_Full.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Disable_Defender_Full.vbs) (or [`Disable_Defender_Full.bat`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Disable_Defender_Full.bat)) and click **"Yes"** on the Windows UAC prompt.

### Re-Enable Windows Defender Full Protection
Double-click [`Enable_Defender_Full.vbs`](file:///c:/Users/Shop%20PC%202/OneDrive/Desktop/Antigravity%20Files/07-System%20Acceleration/Enable_Defender_Full.vbs) and click **"Yes"** on the Windows UAC prompt.

---



## 5. Verification & Safety Guarantees

* **Protected Pro Software Guarantee**:
  - `Internet Download Manager (IDM Pro)`: Active and protected.
  - `Adobe Acrobat Pro`: 100% untouched.
  - `PDF-XChange Editor`: 100% untouched.
  - `Revo Uninstaller Pro`: 100% untouched.
  - `Disk Savvy Pro`: 100% untouched.
  - `FileLocator Pro`: 100% untouched.
* **Productivity Tools Maintained**:
  - `Listary`, `Everything Search`, `Beeftext`, `Directory Opus`, `FashionHubBusyBridge`.
