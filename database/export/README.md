# 개발 DB 데이터 스냅샷

`development-data.json`은 현재 프로젝트의 개발 DB에서 읽기 전용 쿼리로 내보낸 데이터입니다. 운영 DB 백업이 아니며, DB 연결정보·비밀번호·세션·인증 토큰은 포함하지 않습니다.

이번 스냅샷의 `products`, `orders`, `deposits`, `inquiries`, `user_favorites` 테이블은 모두 0건입니다. 빈 테이블은 빈 배열로 기록했으며, 예시 데이터를 추가하지 않았습니다. 내보낸 시각은 JSON의 `exported_at` 필드에 있습니다.

DB 스키마는 `shared/schema.ts`에 정의되어 있습니다. 별도의 대상 DB에 스키마를 생성하려면 해당 실행 환경에 `DATABASE_URL`을 안전하게 설정한 뒤 `npm run db:push`를 사용합니다. 이 JSON은 자동으로 복원되거나 앱 실행 시 자동으로 로드되지 않습니다.

DB 데이터와 참고용 첨부파일이 들어 있는 저장소는 비공개로 유지해야 합니다. 비공개 저장소여도 인증정보는 Git 대신 실행 환경의 Secrets에 보관하세요.
