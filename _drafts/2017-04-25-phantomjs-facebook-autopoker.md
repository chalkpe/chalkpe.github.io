---
published: false
---
## Poke? 콕 찔러보기?
[Facebook](https://www.facebook.com)의 **콕 찔러보기**는 말 그대로 친구를 콕 찌르는 기능입니다. 찔린 친구에게 알림이 가는 것 외에는 아무 짝에도 쓸 곳이 없지만, 서로 찌른 횟수를 알려 주기 때문에 SNS의 순기능인 **시간 낭비**에는 정말로 끝내주는 기능이죠. 자세한 설명은 [Facebook Help Centre](https://www.facebook.com/help/451424538215150)에서 읽어 보세요.

![Facebook 콕 찔러보기 예시]({{site.baseurl}}/assets/facebook-poke-example.png)

## 왜 이런 걸 만들었어요?
저번 주말에도 역시 전 평소처럼 페북에서 시간을 낭비하고 있었습니다. 그런데 그날따라 **나도 콕 찔러보기** (Poke back) 버튼을 누르기가 너무 귀찮았고, [하스스톤](http://playhearthstone.com/)을 하며 한참을 고민하다 **자동으로 버튼을 눌러 주는 스크립트**를 만들어야겠다는 결론을 내렸습니다.

## 그래서 준비했습니다

## 세 줄 요약
1. [Facebook](https://www.facebook.com) '나도 콕 찔러보기' 버튼을 자동으로 누르는 게 필요함
2. [PhantomJS](http://phantomjs.org) 써서 완성은 했는데, 이거 ES2015 문법 지원이 하나도 안 됨
3. [Babel](http://babeljs.io/) 써서 PhantomJS에서 돌아가게 변환하고 [Browserify](http://browserify.org/)로 번들 파일 만듦