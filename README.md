# Habit Tracker

React, TypeScript, Vite, Electron 기반의 데스크톱 습관 관리 앱입니다.

습관을 추가하고 오늘 완료 여부를 체크하며, 최근 기록을 기반으로 스트릭과 완료율을 확인할 수 있습니다. 데이터는 서버 없이 로컬 환경에 저장됩니다.

## Features

- 습관 추가, 수정 및 삭제
- 오늘 완료 체크
- 현재 스트릭, 최고 스트릭, 30일 완료율 표시
- 최근 기록 히트맵 표시
- 다크/라이트 테마 전환
- macOS DMG 빌드 지원

## Tech Stack

- React 19
- TypeScript
- Vite
- Electron
- Electron Builder
- lucide-react

## Data Storage

현재 습관 데이터는 `localStorage`에 저장됩니다.

따라서 데이터는 사용자의 로컬 환경에만 존재하며, 서버나 GitHub와 동기화되지 않습니다. 브라우저/Electron 앱 데이터가 삭제되거나 다른 기기에서 실행하면 기존 데이터는 공유되지 않습니다.

## Getting Started

```bash
npm install
npm run dev
```

웹 개발 서버는 Vite로 실행됩니다.

## Electron App

Electron 앱으로 실행하려면:

```bash
npm run electron
```

이 명령은 먼저 Vite 빌드를 수행한 뒤 Electron 창에서 빌드 결과물을 실행합니다.

## Build

웹 빌드:

```bash
npm run build
```

macOS DMG 빌드:

```bash
npm run dist:mac
```

빌드가 성공하면 DMG 파일은 `release/` 폴더에 생성됩니다.

```text
release/Habit Tracker-0.0.0-arm64.dmg
```

## macOS Security Notice

현재 DMG는 Apple Developer 인증서로 서명 및 공증되지 않은 테스트용 빌드입니다.

GitHub Release에서 다운로드한 앱을 실행할 때 macOS가 앱을 차단하거나 손상되었다고 표시할 수 있습니다. 테스트 목적이라면 앱을 Applications 폴더로 옮긴 뒤 아래 명령으로 quarantine 속성을 제거할 수 있습니다.

```bash
xattr -dr com.apple.quarantine "/Applications/Habit Tracker.app"
open "/Applications/Habit Tracker.app"
```

정식 배포를 위해서는 Apple Developer 인증서 기반 code signing 및 notarization 설정이 필요합니다.

## Project Structure

```text
build/
  icon.icns
  icon.png
electron/
  main.cjs
src/
  components/
  hooks/
  utils/
  App.tsx
```

## Git Workflow

일반 개발 흐름:

```text
Issue 생성
→ develop에서 feature 브랜치 생성
→ 개발
→ PR: feature/* → develop
→ 배포 시 PR: develop → main
→ main에서 DMG 빌드 및 GitHub Release 업로드
```

## Scripts

```bash
npm run dev       # Vite 개발 서버 실행
npm run build     # TypeScript + Vite 빌드
npm run lint      # ESLint 실행
npm run preview   # Vite preview 서버 실행
npm run electron  # Electron 앱 실행
npm run dist:mac  # macOS DMG 빌드
```
