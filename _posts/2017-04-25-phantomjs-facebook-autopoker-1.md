---
layout: post
title: PhantomJS로 "Facebook 콕 찔러보기" 자동화하기 (#1)
date: 2017-04-25 10:23:49 +0900
tags: [web, programming, javascript]
---

## 콕 찔러보기?
[Facebook]의 [**콕 찔러보기**][Pokes]는 말 그대로 친구를 콕 찌르는 기능입니다. 찔린 친구에게 알림이 가는 것 외에는 아무 짝에도 쓸 곳이 없지만, 서로 찌른 횟수를 알려 주기 때문에 SNS의 순기능인 **시간 낭비**에는 정말로 끝내주는 기능이죠. 자세한 설명은 [Facebook Help Centre]에 가 보시면 친절하게 나와 있습니다.

{%
  include image.html
  alt="Facebook 콕 찔러보기 예시"
  path="phantomjs-facebook-autopoker/facebook-poke-example.png"
%}

저번 주말에도 역시 전 평소처럼 페북에서 시간을 낭비하고 있었습니다. 그런데 그날따라 **나도 콕 찔러보기** (Poke back) 버튼을 누르기가 너무 귀찮았고, [하스스톤][Hearthstone]을 하며 한참을 고민하다 **자동으로 버튼을 눌러 주는 스크립트**를 하나 만드는 게 낫겠다는 결론을 내리고 개발을 시작하게 되었습니다.

## 일단 만들어!
### 레이아웃 확인하기
스크립트를 작성하기에 앞서, [페이스북 콕 찔러보기 페이지][Pokes]의 구조를 한 번 살펴 봅시다. 아 참, 스크린샷에서 설명에 필요없는 부분이나 친구들의 개인 정보 등은 깨끗하게 지워 놨어요 ㅎㅎ.

{%
  include image.html
  alt="Facebook 콕 찔러보기 페이지 구조: 메인 콘텐츠 div 선택하기"
  path="phantomjs-facebook-autopoker/pokes-structure-content-area.png"
%}

[Facebook]의 레이아웃을 확인해 보면 좌측에는 **유저 내비게이션**, 중앙에는 **메인 콘텐츠**, 그리고 우측에는 **추천 페이지** 등이 배치되어 있습니다. 우리가 필요한 **콕 찔러보기** 정보는 중앙의 메인 콘텐츠, `div#contentArea` 요소 안에 있군요.

{%
  include image.html
  alt="Facebook 콕 찔러보기 페이지 구조: 콕 찔러보기 div 선택하기"
  path="phantomjs-facebook-autopoker/pokes-structure-pokes-box.png"
%}

그 다음으로는 `div#contentArea` 요소 내부에서 **콕 찔러보기**에 해당되는 부분만을 찾아내야 합니다. *콕 찔러보기* `div`와 *콕 찔러볼 사람 추천* `div` 둘 다 `div._4-u2._xct._4-u8`에 해당되는데, 우리가 필요한 건 첫 번째이기에 `:first-child` 셀렉터를 붙여 **콕 찔러보기**만 선택되도록 하면 되겠네요.

{%
  include image.html
  alt="Facebook 콕 찔러보기 페이지 구조: 나도 콕 찔러보기 버튼 선택하기"
  path="phantomjs-facebook-autopoker/pokes-structure-poke-back-button.png"
%}

마지막으로, 우리의 최종 목표인 **나도 콕 찔러보기** 버튼을 찾아낼 차례만 남았습니다. 클래스가 더럽게 길고 복잡하긴 하지만, 유심히 살펴보니 저 **파란 버튼들**은 `a._42ft._4jy0._4jy3._4jy1.selected._51sy`으로 모두 선택할 수 있군요.

### 코드 작성하기
그럼 이제 페이스북 레이아웃을 주우욱 확인해 가며 찾아낸 CSS 셀렉터를 이용해서 스크립트를 작성해 봅시다.

{% highlight js %}
function getPokeBackButtons () {
  const root = document.getElementById('contentArea') // (1)
  const pokes = root.querySelector('div._4-u2._xct._4-u8:first-child') // (2)
  return [...pokes.querySelectorAll('a._42ft._4jy0._4jy3._4jy1.selected._51sy')] // (3)
}

setInterval(() => getPokeBackButtons().forEach(a => a.click()), 100) // (4)
{% endhighlight %}

우선 `getPokeBackButtons()`는 `(1)` ID로 메인 컨텐츠 영역을 찾아내고, `(2)` 첫 번째인 **나도 콕 찔러보기** 섹션을 가져온 다음, `(3)` 그 섹션에 있는 모든 **나도 콕 찔러보기** 버튼들의 배열을 리턴하는 간단한 함수입니다. 단, `(3)`에서 `pokes.querySelectorAll` 함수가 반환하는 [`NodeList`][NodeList] 객체는 배열이 아니기 때문에 [ES6의 Spread syntax][Spread syntax]를 사용해서 배열로 변환했습니다.

이제 `(4)`에서 `setInterval`로 0.1초마다 **나도 콕 찔러보기** 버튼을 눌러 주게 하면... :tada: 완성! [facebook.com/pokes][Pokes]에 접속한 다음, 개발자 콘솔에 들어가서 위 코드를 복붙하면 엄청난 속도로 친구들을 찔러대는 모습을 보실 수 있습니다 :+1:

## 문제점의 발견
의외로 얼마 안 걸려서 완성했다 싶더니, 역시나 이 방식에는 **크나큰 문제**가 있었습니다. 이거 하나 하자고 브라우저를 계속 켜 놓고 있을 순 없는 노릇이죠 ㅠㅠ. 해결책을 생각해 보던 중 [네이버 로그인][Naver]에 [HtmlUnit]을 [사용했던 게][Staff] 떠올라, 이번에는 JavaScript API를 제공하는 WebKit 기반 Headless 브라우저 [PhantomJS]를 한 번 써 보기로 했습니다. 이 부분은 다음 포스트에서 이어서 설명하도록 하죠!



[Facebook]: https://www.facebook.com/
[Facebook Help Centre]: https://www.facebook.com/help/451424538215150
[Hearthstone]: http://playhearthstone.com/
[Naver]: https://www.naver.com

[Pokes]: https://www.facebook.com/pokes
[PhantomJS]: http://phantomjs.org/
[HtmlUnit]: http://htmlunit.sourceforge.net/
[Staff]: https://github.com/ChalkPE/Takoyaki/blob/master/src/main/java/pe/chalk/takoyaki/Staff.java

[NodeList]: https://developer.mozilla.org/en-US/docs/Web/API/NodeList
[Spread syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
