---
layout: post
title: PhantomJS로 "Facebook 콕 찔러보기" 자동화하기
date: '2017-04-25 10:23:49 +0900'
tags:
  - web
  - programming
  - javascript
published: true
---

## 콕 찔러보기?
[Facebook](https://www.facebook.com/)의 **콕 찔러보기**는 말 그대로 친구를 콕 찌르는 기능입니다. 찔린 친구에게 알림이 가는 것 외에는 아무 짝에도 쓸 곳이 없지만, 서로 찌른 횟수를 알려 주기 때문에 SNS의 순기능인 **시간 낭비**에는 정말로 끝내주는 기능이죠. 자세한 설명은 [Facebook Help Centre](https://www.facebook.com/help/451424538215150)에서 읽어 보세요.

{% include image.html path="facebook-poke-example.png" alt="Facebook 콕 찔러보기 예시" %}

저번 주말에도 역시 전 평소처럼 페북에서 시간을 낭비하고 있었습니다. 그런데 그날따라 **나도 콕 찔러보기** (Poke back) 버튼을 누르기가 너무 귀찮았고, [하스스톤](http://playhearthstone.com/)을 하며 한참을 고민하다 **자동으로 버튼을 눌러 주는 스크립트**를 하나 작성하자는 결론을 내리고 개발을 시작하게 되었습니다.

## 일단 만들어!
### 간단하게 시작
우선 브라우저에서 돌아갈 짧은 스크립트를 작성해 봅시다.

```js
setInterval(() => [...document.getElementsByTagName('a')]
  .filter(a => a.innerText.includes('Poke back'))
  .forEach(a => a.click()), 100)
```
[facebook.com/pokes](https://www.facebook.com/pokes) 페이지에 접속한 다음, 개발자 콘솔에 들어가서 위 코드를 복붙하면 끝! 0.1초마다 버튼을 찾아서 클릭해 주는 정말 간단한 코드지만, 어찌 되었든 잘 돌아갑니다.

### 고통의 시작
의외로 얼마 안 걸려서 완성했다 싶더니, 역시나 이 방식에는 문제가 있었습니다. 이거 하나 하자고 브라우저를 계속 켜 놓고 있을 순 없는 노릇이죠. 해결책을 생각해 보던 중 [네이버 로그인](https://github.com/ChalkPE/Takoyaki/blob/master/src/main/java/pe/chalk/takoyaki/Staff.java)에 [HtmlUnit](http://htmlunit.sourceforge.net/)을 사용했던 게 떠올라, JavaScript API를 제공하는 Headless 브라우저 [PhantomJS](http://phantomjs.org/)를 한 번 써 보기로 했습니다.

## 세 줄 요약
1. 브라우저 없이 [Facebook](https://www.facebook.com) '나도 콕 찔러보기' 버튼을 자동으로 누르는 게 필요함
2. [PhantomJS](http://phantomjs.org) 써서 완성은 했는데, ES2015 지원이 안 되는지라 코드가 지저분함
3. [Babel](http://babeljs.io/) 써서 PhantomJS에서 돌아가게 변환하고 [Browserify](http://browserify.org/)로 번들 파일 만듦
