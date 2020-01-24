# NodeSite

## Node.js로 구현한 게시판형 사이트

### 기술 스택
- 프론트엔드
  - HTML, CSS, JavaScript(ES6)
  - PUG
- 백엔드
  - Node.js
  - Express, MySQL, REST API

### 기능
- 회원관리
- 게시글 CRUD
- 댓글 CRUD
- 해시태그
- 구독
- 좋아요

### 기본 기능 구현
- 회원관리
    - [X] 로그인 / 로그아웃
    - [X] 회원가입
    - [X] 조회
    - [X] 생성
    - [X] 수정
    - [X] 탈퇴
    - [X] 구독
- 게시글
    - [X] 조회
    - [X] 생성
    - [X] 수정
    - [X] 삭제
    - [X] 해시태그
    - [X] 좋아요
- 댓글
    - [X] 조회
    - [X] 생성
    - [X] 수정
    - [X] 삭제

### 추가 기능 구현
- 회원관리
    - [ ] 회원 등급
    - [ ] 핸드폰 인증 API
    - [ ] 비밀번호 암호화 ( bcrypt )
    - [ ] 회원 이미지 ( multer )
- 게시글
    - [ ] 에디터 사용 ( CKEditor )
    - [ ] 검색
    - [ ] 정렬 ( 조회수, 좋아요, 최신 )
    - [X] 페이징
- 구독
    - [ ] 새 게시글 알람 ( API )

### DB
![DB](image/DB.png)
[DB Table](https://aquerytool.com/aquerymain/index/?rurl=92fd13a3-cdd7-4beb-881e-4413e9aeda33)
- PW : oz35vx 