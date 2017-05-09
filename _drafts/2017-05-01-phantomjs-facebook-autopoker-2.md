---
layout: post
title: PhantomJS로 "Facebook 콕 찔러보기" 자동화하기 (#2)
date: 2017-05-01 16:52:11 +0900
tags: [web, programming, javascript]
---

## 개요
[1편에서 만들었던 짧은 코드][1편 코드]는 성공적으로 친구들을 콕 찔러 줬지만, 브라우저를 내내 켜 놓고 있어야만 한다는 문제가 있었습니다.
그래서 이 불편한 상황을 해결하기 위해, 이번 포스트에서는

1. [PhantomJS]로 [Pokes] 페이지에 접속한 다음,
1. 입력받은 페이스북 계정으로 자연스럽게 로그인을 하고,
1. 콕 찔러보기 페이지에서 **나도 콕 찔러보기** 버튼을 보이는 족족 눌러 주는

간단한 프로그램을 만들 겁니다. 핵심은 이 모든 작업이 수행되는 곳이 내 브라우저의 페북 페이지가 아니라는 거죠!

## PhantomJS 설치
[직접 설치할 수도 있지만](http://phantomjs.org/download.html), 어떤 플랫폼이든 상관없이 간단하게 [PhantomJS]를 설치해 주는 `phantomjs-prebuilt` [래퍼][Wrapper]를 이용하도록 하겠습니다. 다음 명령들을 콘솔에 입력하고 설치가 끝날 때까지 [노래](https://youtu.be/h--P8HzYZ74)나 한 곡 듣고 계세요.

{% highlight bash %}
mkdir facebook-autopoker
cd facebook-autopoker && npm init
npm install --save phantomjs-prebuilt
{% endhighlight %}

### npm 스크립트 추가하기
매번 [PhantomJS] 실행한다고 `node_modules/.bin/phantomjs autopoker.js` 같은 긴 커맨드를 입력할 수는 없는 노릇이죠. `package.json` 파일의 `scripts` 필드에 `start` 스크립트를 추가하면 `npm start` 한 방에 실행할 수 있게 됩니다.

{% highlight json %}
{
  ...
  "scripts": {
    "start": "phantomjs autopoker.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  ...
}
{% endhighlight %}

## PhantomJS로 Facebook 로그인하기
고통과 인내의 시간이 다시 돌아왔습니다. 우리가 해야 할 걸 생각해 보면...

1. [facebook.com/pokes][Pokes] 페이지로 가기
1. 이메일 칸과 비밀번호 칸에 내 계정 이메일과 비밀번호 입력하기
1. 로그인 버튼을 누르고 로그인이 잘 됐기를 간절히 기다리기

### 페이지 이동
{% highlight js %}
var webpage = require('webpage') // (1)

var page = webpage.create()
page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'

page.open('https://www.facebook.com/pokes', function (status) { // (2)
  console.log('status is ' + status)
  console.log('url is ' + page.url) // (3)

  setTimeout(function () {
    console.log('url is now ' + page.url) // (4)
  }, 10000)
})
{% endhighlight %}

1. `npm` 모듈이 아닌 PhantomJS API의 [Web Page] 모듈입니다.
1. [Pokes] 페이지가 열리거나 오류가 났을 때 호출됩니다. `status`는 `success` 또는 `fail`입니다.
1. 현재 페이지의 URL을 출력합니다. 리다이렉트되기 전입니다.
1. 10초 후 다시 현재 페이지의 URL을 출력합니다.

{% highlight bash %}
$ npm start
status is success
url is https://www.facebook.com/pokes
url is now https://www.facebook.com/login.php?next=https%3A%2F%2Fwww.facebook.com%2Fpokes
{% endhighlight %}

페이지 접속에 성공했다면 `/pokes` 페이지에서 `/login.php`로 리다이렉트된 것을 확인할 수 있습니다.

### DOM 다루기
브라우저에서 <https://www.facebook.com/pokes> 페이지에 접속하고 F12를 눌러 게임을 시작해 봅시다.

{%
  include image.html
  alt="Facebook 로그인 페이지"
  path="phantomjs-facebook-autopoker/facebook-login.gif"
  caption="이거... 생각보다 일찍 끝나겠는데?"
%}

고맙게도 이번엔 필요한 세 요소에 전부 ID가 설정돼 있어서 굳이 적절한 CSS 셀렉터를 고민하지 않아도 됩니다.
`document.getElementById` 메서드를 사용해서 이렇게 간단하게 우리가 필요한 것들을 쏙쏙 뽑아올 수 있죠!

{% highlight js %}
function login (email, password) {
  var emailInput = document.getElementById('email')
  if (emailInput) emailInput.value = email

  var passwordInput = document.getElementById('pass')
  if (passwordInput) passwordInput.value = password

  var loginButton = document.getElementById('loginbutton')
  if (loginButton) loginButton.click()
}
{% endhighlight %}

PhantomJS에서 DOM에 접근하려면 [`page.evaluate()`][Evaluate] 메서드에 실행할 코드를 함수로 전달해야 합니다. 이 때 전달된 함수는 샌드박스에서 실행되기 때문에 함수 바깥의 변수에 접근할 수 없다는 점에 유의하세요.

{% highlight js %}
// 2번째 인자부터는 login 함수의 파라미터로 전달됩니다
page.evaluate(login, "wow@doge.com", "p@ssw0rd")
{% endhighlight %}

### 현재 페이지 캡쳐하기
그럼 이제 로그인이 다 되었는지 볼까요? `page.render()` 메서드를 사용해 현재 열려 있는 페이지를 이미지로 확인할 수 있습니다. 로그인에 조금 시간이 걸리기 때문에 `setTimeout`으로 딜레이를 주는 걸 잊지 마세요.

{% highlight js %}
// 페이지 해상도를 FHD로 조정합니다
page.viewportSize = { width: 1920, height: 1080 }

// 10초 후 현재 디렉토리에 저장됩니다
setTimeout(function () { page.render('facebook.png') }, 10000)
{% endhighlight %}

## 지금까지의 코드: 로그인까지
{% highlight js %}
var page = require('webpage').create()
page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'

function login (email, password) {
  var emailInput = document.getElementById('email')
  if (emailInput) emailInput.value = email

  var passwordInput = document.getElementById('pass')
  if (passwordInput) passwordInput.value = password

  var loginButton = document.getElementById('loginbutton')
  if (loginButton) loginButton.click()
}

page.open('https://www.facebook.com/pokes', function (status) {
  console.log('status is ' + status)
  console.log('url is ' + page.url)

  setTimeout(function () {
    console.log('url is now ' + page.url)
    page.evaluate(login, "wow@doge.com", "p@ssw0rd")

    page.viewportSize = { width: 1920, height: 1080 }
    setTimeout(function () { page.render('facebook.png') }, 10000)
  }, 10000)
})
{% endhighlight %}

## PhantomJS에서 ES6 사용하기
안타깝게도 PhantomJS의 자바스크립트 엔진은 ES6 문법을 지원하지 않습니다. 하지만 Babel을 끼얹는다면 조금 복잡해지겠지만 불가능하지는 않죠!

{% highlight js %}
function getPokeBackButtons () {
  const root = document.getElementById('contentArea')
  const pokes = root.querySelector('div._4-u2._xct._4-u8:first-child')
  return [...pokes.querySelectorAll('a._42ft._4jy0._4jy3._4jy1.selected._51sy')]
}

setInterval(() => getPokeBackButtons().forEach(a => a.click()), 100)
{% endhighlight %}

[Pokes]: https://www.facebook.com/pokes
[PhantomJS]: http://phantomjs.org
[Web Page]: http://phantomjs.org/api/webpage/
[Evaluate]: http://phantomjs.org/api/webpage/method/evaluate.html
[Wrapper]: https://github.com/Medium/phantomjs
[1편 코드]: {% link _posts/2017-04-25-phantomjs-facebook-autopoker-1.md %}#코드-작성하기
