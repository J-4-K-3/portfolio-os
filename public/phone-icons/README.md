# Xiaomi phone app icons

The launcher reads PNGs from this folder using each app's ID as the filename. The icons below are already present. Keep their exact lowercase names and use square images (256 × 256 px or larger). The downloaded Google/Opera/Xiaomi artwork has its own brand colors; for transparent PNGs, use the solid backplate color listed below rather than a gradient or multicolor palette.

| App | Filename | Backplate for transparent artwork | Status |
| --- | --- | --- | --- |
| Moon | `moon.png` | `#33406F` deep indigo | Done |
| G.R.O.A. | `groa.png` | `#3597A1` teal | Done |
| Google Files | `files.png` | `#F1F3F4` light gray | Downloaded |
| Google Photos | `photos.png` | `#FFFFFF` white | Downloaded |
| Play Store | `store.png` | `#FFFFFF` white | Downloaded |
| Opera Browser | `browser.png` | `#FFFFFF` white | Downloaded |
| VS Code | `vscode.png` | `#007ACC` blue | Downloaded |
| Clock | `clock.png` | `#F5F7FA` near-white | Downloaded |
| Google Contacts | `contacts.png` | `#E8F0FE` pale blue | Downloaded |
| Xiaomi Music | `music.png` | `#FF6900` Xiaomi orange | Downloaded |

The solid backplates for the downloaded icons are defined in `src/phone/InnoxationPhone/shell/HomeScreen.css`, so the launcher, dock, and app search results stay consistent. Icons bundled in `src/assets/app_icons/` do not need copies here: `auri_logo.png`, `telvin_logo.png`, `natter_logo.png`, and `appgrade_logo.png`.

The “Focus below” app names are also used in the launcher and their app screens. The IDs and filenames stay stable so installed-app and navigation behavior continue to work.