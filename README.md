# Typestagram

인스타그램과 비슷한, 익숙한 형태의 CRUD 어플리케이션을 새로 시도하는 스택으로 만든 프로젝트입니다.

## 프로젝트 데모

https://typestagram.site (데모아이디로 로그인하기 버튼 클릭)

## 개요

-   [스택 및 배포](#스택-및-배포)
-   [기능](#기능)
-   [프로젝트 후기](#프로젝트-후기)

## 스택 및 배포 <a id='스택-및-배포'></a>

**프론트**

-   Next.js
-   (상태관리 및 데이터페칭) Redux & Redux-toolkit, SWR, Axios
-   (기타) Chakra-UI, Formik, Yup

**백엔드**

-   Node.js, Express
-   (데이터베이스) MySQL, TypeORM
-   (Auth) Passport, JWT

**배포**

-   클라이언트 - Netlify
-   서버 - AWS EC2, AWS-S3
-   (기타) 커스텀 도메인 및 Nginx와 certbot-auto를 활용한 https 적용

## 기능 <a id='기능'></a>

-   [회원가입 로그인 및 OAuth](#회원가입-로그인-및-OAuth)
-   [포스트 CRUD](#포스트-CRUD)
-   [댓글 작성과 좋아요 기능](#댓글-작성과-좋아요-기능)
-   [무한 스크롤 및 검색 지연](#무한-스크롤-및-검색-지연)
-   [팔로우 맺기](#팔로우-맺기)
-   [프로필 편집](#프로필-편집)

    <br/>
    <br/>
    <br/>

### 회원가입 로그인 및 OAuth <a id='회원가입-로그인-및-OAuth'></a>

**로그인 플로우**

![로그인 플로우](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/login_draw.png?raw=true)
<br />

![로그인_1](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/login_1.gif?raw=true)
<br />

-   리덕스 대신 원격으로 데이터를 가져오는 데에 SWR을 사용함에 따라
    SWR에 유저 정보를 저장합니다.
-   새로 고침시에도 쿠키의 유효성을 확인하고 유저 정보를 다시 가져올 수 있게 revalidate 옵션을 설정했습니다.
-   또한 로그인이 되지 않으면 로그인 페이지와 로그인에 필요햔 redirect 페이지를 제외한 모든 페이지에 접근 할 수 없도록 설정되어 있습니다.

<details>
<summary>관련 코드</summary>
<div>
<br/>

[client/pages/\_app.tsx](https://github.com/Knorway/typestagram/blob/main/client/pages/_app.tsx)

[client/lib/matchPathname.tsx](https://github.com/Knorway/typestagram/blob/main/client/lib/matchPathname.ts)

</div>
</details>
<br/>

### 포스트 CRUD <a id='포스트-CRUD'></a>

![포스트_1](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/post_crud_1.gif?raw=true)

-   중앙 하단의 \+ 버튼을 클릭하여 포스트를 작성하여 서버로 전송후 정보를 되돌려 받아 포스트를 표시하게 됩니다.
-   포스트 수정도 마찬가지로 같은 모달창을 재사용하여 활용하는 형태로 기능합니다.
    <br/>
    <br/>

### 댓글 작성과 좋아요 기능 <a id='댓글-작성과-좋아요-기능'></a>

![좋아요_1](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/like_1.gif?raw=true)

-   사진을 더블클릭 하거나 하트 아이콘을 눌러 포스트를 좋아요 합니다.
-   어두운 오버레이에 하트 아이콘을 표시하여 시각적으로 성공 여부를 확인 할 수 있습니다.
-   댓글 작성후 돌아오는 결과를 SWR 캐쉬에 push 하여 업데이트 합니다.
-   좋아요는 서버의 성공/실패 결과를 기다리지 않고 먼저 낙관적으로 기능합니다.
    <br/>
    <br/>
    <br/>

### 무한 스크롤 및 검색 지연 <a id='무한-스크롤-및-검색-지연'></a>

![스크롤_1](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/infinite_1.gif?raw=true)
<br/>
<br/>
<br/>

-   모달 \+ 버튼을 또 다시 재사용 하여 무한 스크롤을 시각적으로 표현합니다.
-   throttle 함수를 만들어서 해당 기능을 구현했습니다. 해당 코드

<details>
<summary>해당 코드</summary>
<div>

```javascript
`client/lib/throttle.tsx`;

export const throttle = (callback: CallableFunction, delay: number) => {
	let intervalId = null;

	return (...args: any) => {
		if (intervalId) return;
		intervalId = setInterval(() => {
			callback(...args);
			clearInterval(intervalId);
			intervalId = null;
		}, delay);
	};
};
```

</div>
</details>
<br />

<br/>
<br/>
<br/>

![스크롤_2](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/inifinite_2.gif?raw=true)
<br/>
<br/>
<br/>

-   사용자가 입력을 멈추기 전까지 로딩 스피너가 돌면서 자동완성이 될 것이라는 힌트를 줍니다.
-   debounce 함수를 만들어서 해당 기능을 구현했습니다. 해당 코드

<details>
<summary>해당 코드</summary>
<div>

```javascript
`client/lib/debounce.tsx`;

export const debounce = (callback: CallableFunction, delay: number) => {
	let timeout = null;

	return (...args: any) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), delay);
	};
};
```

</div>
</details>
<br />

<br/>
<br/>
<br/>

### 팔로우 맺기 <a id='팔로우-맺기'></a>

![팔로우_1](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/follow_1.gif?raw=true)

-   포스트의 더 보기 버튼을 클릭하여 해당 유저를 팔로우/언팔로우 합니다
-   서버 통신 결과에 따라 다이얼로그를 화면에 표시합니다

<details>
<summary>관련 코드</summary>
<div>
<br/>

[server/src/entity/junction/Followship.ts](https://github.com/Knorway/typestagram/blob/main/server/src/entity/junction/Followship.ts)

[server/src/routes/user/index.ts](https://github.com/Knorway/typestagram/blob/main/server/src/routes/user/index.ts#L96)

</div>
</details>
<br/>
    <br/>
    <br/>
    <br/>

### 프로필 편집 <a id='프로필-편집'></a>

![프로필_1](https://github.com/Knorway/ImageBucket/blob/main/ImageBucket/project/typestagram/profile_1.gif?raw=true#)

-   닉네임/자기소개와 비밀번호 재설정 및 프로필 사진 변경이 가능합니다.
-   로그인/회원가입 페이지와 동일하게 formik을 사용하여 유효성 검사를 합니다.
    <br/>
    <br/>
    <br/>

## 프로젝트 후기 <a id='프로젝트-후기'></a>

익숙한 구조의 앱을 만들긴 했지만 타입스크립트, TypeORM, SWR 그리고 리덕스에 타입스크립트를 적용하는 부분 등
이미 아는 것도 시도하는 스택 대부분이 처음이라 진도가 생각보다 안 나갔던 프로젝트 였습니다.
다만 책이나 강의에서 벗어나 만들고 싶은 앱의 모양을 내가 원하는 도구로 스스로 실현시켰다는 점에서 보람도 많이 느꼈고
어떤 정형화된 모양이나 스택을 벗어나면 러닝 소스가 부족하기 때문에 학습에 있어 다른 사람의 레포를 읽는 것이 얼마나 중요한지,
그리고 이 이상의 성장을 위해 현업에서 일하고 싶다는 생각이 강하게 들기도 한 프로젝트였습니다.

기술적인 측면에서는 우선 지난 프로젝트에서 프론트 엔드 로직 대부분을 차지했던 리덕스로 데이터를 가져오는 부분을 SWR로 대체하게 되었는데
정말 괜찮다는 생각이 들었습니다. 데이터 페칭 라이브러리들이나 zustand, recoil 등의 대체체들의 부상으로 리덕스를 앞으로는 쓰지 않을 것이다라는 의견도 많이 접했었는데
이렇게 페칭 부분을 덜어내고 Redux-toolkit을 사용하니 스토어가 굉장히 날씬해져서 굳이 쓰지 않을 이유도 없지 않을까? 하는 생각도 들었습니다.

서버측 코드도 꽤나 많은 비중을 차지하는데 패스포트나 로그인 플로우는 이미 조금 익숙해진 탓인지 타입 정의를 제외하면 크게 어렵지는 않았습니다.
시퀄라이즈의 모델 네이밍이 혼란스럽게 느껴져서 TypeORM을 사용하게 되었고 사실 타입스크립트를 쓰게 된 계기가 되었습니다.
다만 공식 문서에서 많은 도움을 받지 못해 TypeORM을 사용한 프로젝트들의 데이터 모델링 레포들을 찾아다니며 학습을 하게 되어 조금 어려움도 있었습니다.

가장 중요한 타입스크립트는 어차피 자바스크립트인데 크게 부담갖지 말고 시작해볼까 라는 생각에 시도, 프로젝트는 마무리 하였지만
사용하면서도 면피용 코드를 작성한다는 것이 느껴지고 타입스크립트를 도입해봤다 그 이상의 무언가는 사실 해보지 못해봤기에 도입은 쉽지만 잘하는 것은 어렵다라는 생각과 함께 좋은 언어라는 생각이 들어 현재 최우선으로 학습중에 있습니다.
