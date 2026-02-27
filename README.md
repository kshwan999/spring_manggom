# 🐻 Spring Manggom : Interactive Seasonal Art

망곰 캐릭터와 함께하는 감성적인 사계절 인터랙티브 웹 아트 프로젝트입니다.

<div align="center">
  <h3>"너무춥곰... 하지만 봄은 온다곰! 🌸❄️"</h3>
  <p>Canvas API와 React를 활용한 고품질 캐릭터 애니메이션 데모</p>
</div>

---

## ✨ 주요 특징 (Key Features)

### 1. ❄️ 겨울 테마 (Winter Mode - Default)

- **앙상한 숲:** 잎이 다 떨어진 나무들과 짙은 네이비 톤의 차가운 배경.
- **눈 물리 효과:** 단순히 아래로 내리는 것이 아니라, 바람에 나부끼며 좌우로 흔들리는 눈송이.
- **울먹이는 망곰:** 추위에 바들바들 떠는 **Jitter 애니메이션**과 탱글탱글하게 움직이는 **콧물 방울(Snot Bubble)**.
- **겨울 대사:** 머리 위로 떠오르는 "너무춥곰" 텍스트.

### 2. 🌸 봄 테마 (Spring Mode)

- **벚꽃 숲:** 화사한 핑크빛 나무들과 흩날리는 벚꽃잎 파티클.
- **활기찬 망곰:** 겨울의 슬픈 표정에서 벗어나 활기차게 웃는 모습과 귀여운 **고깔 모자** 착용.
- **봄 대사:** 통통 튀는 모션과 함께 나타나는 "봄이다!!" 텍스트.

### 3. 🖐️ 인터랙션 (Interactions)

- **쓰다듬기 (Petting):** 마우스로 망곰이의 머리를 쓰다듬으면 얼굴이 찌부러지는(Squishy) 물리 효과와 함께 행복한 표정으로 변화.
- **반응형 파티클:** 눈과 벚꽃잎이 마우스 커서의 움직임(풍압)에 반응하여 흩어짐.
- **아이 트래킹:** 망곰이의 눈동자가 마우스 포인터를 실시간으로 추적.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Rendering:** HTML5 Canvas API (Vanilla JS logic)
- **Styling:** Tailwind CSS
- **Animation:** [Motion](https://motion.dev/) & requestAnimationFrame

---

## 🚀 시작하기 (Getting Started)

### 사전 준비

- [Node.js](https://nodejs.org/) (최신 LTS 권장)

### 설치 및 실행

1. 저장소 클론 및 패키지 설치:

   ```bash
   npm install
   ```

2. 로컬 서버 실행:

   ```bash
   npm run dev
   ```

3. 브라우저에서 `http://localhost:3000` 접속

---

## 🎨 디자인 철학 (Design Identity)

- **일체형 실루엣:** 귀와 얼굴의 경계를 없애 망곰이 특유의 말랑말랑한 '식빵형' 얼굴을 완벽하게 재현.
- **Micro-Animations:** 콧물의 박동 효과, 텍스트의 떨림 강도 조절 등 보이지 않는 디테일에 집중.

---

## 🗺️ Roadmap

- [ ] 여름/가을 테마 확장 (여름 바다, 가을 단풍)
- [ ] 사운드 피드백 추가 ('뽀용' 소리 및 BGM)
- [ ] 모바일 터치 이벤트 최적화

---

*Created with ❤️ by Antigravity & USER*
