# NodeSite
## Node.js로 구현한 게시판형 사이트
- [DB Table](https://aquerytool.com/aquerymain/index/?rurl=92fd13a3-cdd7-4beb-881e-4413e9aeda33)
    - PW : oz35vx 
- ### 추가한 사항
    - 회원
      - 로그인
      - 로그아웃
      - 회원가입
      - 내 정보
      - 내 게시글
      - 내 댓글

    - 게시글
      - CRUD
      - 조회수 기능

    - 댓글
      - CRD ( Update 나중  AJAX)
  
    - 해시태그

    - 구독
      - 구독하기
      - 구독 취소

    - 좋아요 (게시글)
      - 좋아요
      - 좋아요 취소

- ### 추가해야 할 사항
    - 등급
      - 개발자
      - 운영자
      - 회원

    - 회원
      - 핸드폰 인증 ( API )
      - 암호 암호화 ( bcrypt )
      - 이미지 추가 ( multer )
      - 회원정보 수정 페이지
        - 타인에게 보이는 정도
        - 비밀번호 수정
      - 타 회원 정보 보기

    - 게시글
      - 에디터 사용 ( CKEditor )
      - 목록 페이징 처리
      - 목록 정렬 기능
        - 조회수
        - 좋아요
        - 최신순
      - 검색 기능
        - 제목
        - 제목 + 내용
        - 글쓴이


    - 구독
      - 구독자가 새 게시글 쓸 경우 알람.(API)

    - 댓글
      - 댓글 수정 ( 비동기 통신으로 페이지 이동없이 작동 )

    - 구독, 좋아요 :: 비동기 통신으로 페이지 이동없이 작동

    - 한번에 삭제하기 ( post 삭제시 댓글 삭제, 등등 ) -> cascade 이용해도 안됨.

- ### 기술 스택
  - 프론트엔드
    - HTML, CSS, JavaScript(ES6)
    - PUG
  - 백엔드
    - Node.js
    - Express, MySQL, REST API




- ### Reference