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
[직접 설치할 수도 있지만](http://phantomjs.org/download.html), 어떤 플랫폼이든 상관없이 간단하게 [PhantomJS]를 설치해 주는 `phantomjs-prebuilt` [래퍼][Medium/phantomjs]를 이용하도록 하겠습니다. 다음 명령들을 콘솔에 복붙하고 [노래](https://youtu.be/h--P8HzYZ74)나 한 곡 듣고 계세요 ㅎㅎ.

{% highlight bash %}
mkdir facebook-autopoker
cd facebook-autopoker && npm init
npm install --save phantomjs-prebuilt
{% endhighlight %}

## PhantomJS로 Facebook 로그인하기
고통과 인내의 시간이 다시 돌아왔습니다. 우리가 해야 할 걸 생각해 보면...

1. [facebook.com/pokes][Pokes] 페이지로 가기
1. 이메일 칸과 비밀번호 칸에 내 계정 이메일과 비밀번호 입력하기
1. 로그인 버튼을 누르고 로그인이 잘 됐기를 간절히 기다리기

### 페이지 이동
다음 코드를 `autopoker.js` 파일에 입력하고, `node_modules/.bin/phantomjs autopoker.js` 커맨드로 실행해 보세요.

{% highlight js %}
var webpage = require('webpage') // (1)
var page = webpage.create()

page.open('https://www.facebook.com/pokes', function (status) { // (2)
  console.log('status is ' + status)
  console.log('url is ' + page.url) // (3)

  setTimeout(function () {
    console.log('url is now ' + page.url) // (4)
  }, 10000)
})

{% endhighlight %}

코드에 대해서 설명을 하자면,

- `(1)`의 `webpage`는 `npm` 모듈이 아닌 PhantomJS API의 [Web Page] 모듈입니다.
- `(2)`의 콜백은 [Pokes] 페이지가 열리거나 오류가 났을 때 호출됩니다. `status` 인자의 값은 `success` 또는 `fail`입니다.
- `(3)`에서는 현재 페이지의 URL을 출력합니다. 페이지가 열리자마자 출력되므로 <https://www.facebook.com/pokes>일 겁니다.
- `(4)`에서는 10초 후 다시 현재 페이지의 URL을 출력합니다. 만약 페이지가 리다이렉트됐다면 출력 결과가 다르겠죠.

{% highlight bash %}
$ node_modules/.bin/phantomjs autopoker.js
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
  caption="이거, 생각보다 일찍 끝나겠는데?"
%}

고맙게도 이번엔 필요한 세 요소에 전부 ID가 설정돼 있어서 굳이 적절한 CSS 셀렉터를 고민하지 않아도 됩니다.
`document.getElementById` 메서드를 사용해서 이렇게 간단하게 우리가 필요한 것들을 쏙쏙 뽑아올 수 있죠!

{% highlight js %}
var emailInput = document.getElementById('email')
if (emailInput) emailInput.value = 'doge@example.com'

var passwordInput = document.getElementById('pass')
if (passwordInput) passwordInput.value = 'p@ssw0rd'

var loginButton = document.getElementById('loginbutton')
if (loginButton) loginButton.click()
{% endhighlight %}

## Node.js로 PhantomJS 조작하기
기본적으로 [PhantomJS]는 완전히 별개의 프로그램이기 때문에, Node.js에서 사용하려면 `child_process` 모듈로 [PhantomJS] 프로세스를 만들어 주어야 합니다. 다행히도 `phantomjs-prebuilt` 패키지에서 더 간단하게 하는 방법을 제공하고 있으니 그걸 따르도록 하죠.

{% highlight js %}
const phantomjs = require('phantomjs-prebuilt')
const program = phantomjs.exec('script.js', 'arg1', 'arg2')

program.stdout.pipe(process.stdout)
program.stderr.pipe(process.stderr)
program.on('exit', code => console.log('Exit code:', code))
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
[Medium/phantomjs]: https://github.com/Medium/phantomjs
[1편 코드]: {% link _posts/2017-04-25-phantomjs-facebook-autopoker-1.md %}#코드-작성하기
