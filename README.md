# 메수라이브

메이플스토리에 도움이 되는 정보를 제공하는 서드파티 웹 앱입니다.

## Tools
[![React](https://img.shields.io/badge/React-61DAFB.svg?&style=for-the-badge&logo=React&logoColor=333)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000.svg?&style=for-the-badge&logo=Next.js)](https://nextjs.org/)
[![NextUI](https://img.shields.io/badge/NextUI-000000.svg?&style=for-the-badge&logo=NextUI)](https://nextui.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4.svg?&style=for-the-badge&logo=Tailwind-CSS&logoColor=FFF)](https://nextui.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748.svg?&style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

## 개발 환경
- Node.js 22
- pnpm 9.15.1

## 설치
```bash
pnpm install
```
## 기타
- 잠재능력 DB 업데이트는 `pnpm prefetchPotentialData` command로 이루어집니다.
  - 코드에서 업데이트 범위를 지정해야 합니다.
  - 실행 전 `package.json`에 `"type": "module"`을 추가해야 합니다.
    - tsx의 `--experimental-default-type=module` [issue](https://github.com/privatenumber/tsx/issues/687)로 인해 필요.
- [Turborepo](https://turbo.build/repo/docs)를 사용할 수 있습니다.