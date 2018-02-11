+++
menu = "main"
title = 'PhantomJS로 "Facebook 콕 찔러보기" 자동화하기 (#2)'
date = "2017-05-01 16:52:11 +0900"
tags = ["web", "programming", "javascript", "phantomjs", "facebook"]
+++

## 개요
[1편에서 만들었던 짧은 코드][1편 코드]는 성공적으로 친구들을 콕 찔러 줬지만, 브라우저를 내내 켜 놓고 있어야만 한다는 문제가 있었습니다.
그래서 이 불편한 상황을 해결하기 위해, 이번 포스트에서는

1. [PhantomJS]로 [Pokes] 페이지에 접속한 다음,
1. 입력받은 페이스북 계정으로 자연스럽게 로그인을 하고,
1. 콕 찔러보기 페이지에서 **나도 콕 찔러보기** 버튼을 보이는 족족 눌러 주는

간단한 프로그램을 만들 겁니다. 핵심은 이 모든 작업이 수행되는 곳이 내 브라우저의 페북 페이지가 아니라는 거죠!

## PhantomJS 설치하기
[직접 설치할 수도 있지만](http://phantomjs.org/download.html), 어떤 플랫폼이든 상관없이 간단하게 [PhantomJS]를 설치해 주는 `phantomjs-prebuilt` [래퍼][Wrapper]를 이용하도록 하겠습니다. 다음 명령들을 콘솔에 입력하고 설치가 끝날 때까지 [노래](https://youtu.be/h--P8HzYZ74)나 한 곡 듣고 계세요.

```bash
mkdir facebook-autopoker
cd facebook-autopoker && npm init
npm install --save phantomjs-prebuilt
```

### npm 스크립트 추가하기
매번 [PhantomJS] 실행한다고 `node_modules/.bin/phantomjs autopoker.js` 같은 긴 커맨드를 입력할 수는 없는 노릇이죠. `package.json` 파일의 `scripts` 필드에 `start` 스크립트를 추가하면 `npm start` 한 방에 간단하게 실행할 수 있습니다.

```json
{
  ...
  "scripts": {
    "start": "phantomjs autopoker.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  ...
}
```

## PhantomJS로 Facebook 로그인하기
고통과 인내의 시간이 다시 돌아왔습니다. 우리가 해야 할 걸 생각해 보면...

1. [facebook.com/pokes][Pokes] 페이지로 이동하기
1. 로그인 페이지로 리다이렉트될 때까지 기다리기
1. 이메일 칸과 비밀번호 칸에 내 계정 정보 입력하기
1. 로그인 버튼을 누르고 [Pokes] 페이지로 돌아올 때까지 기다리기

이 정도가 되겠군요.

### [Pokes] 페이지로 이동하기
```js
var webpage = require('webpage') // (1)

var page = webpage.create()
page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0' // (2)

page.open('https://www.facebook.com/pokes', function (status) { // (3)
  console.log('status is ' + status) // (4)
  console.log('url is ' + page.url) // (5)

  setTimeout(function () {
    console.log('url is now ' + page.url) // (6)
  }, 5000)
})
```

1. `npm` 모듈이 아닌 PhantomJS API의 [Web Page] 모듈입니다.
1. 브라우저의 `User-Agent` 값을 최신 버전의 파이어폭스로 변경합니다.
1. [Pokes] 페이지가 열렸거나 오류가 났을 때 호출됩니다.
1. `status`의 값은 `'success'` 또는 `'fail'`입니다.
1. 현재 열려 있는 페이지의 URL을 출력합니다.
1. 5초 후 다시 현재 페이지의 URL을 출력합니다.

```bash
$ npm start
status is success
url is https://www.facebook.com/pokes
url is now https://www.facebook.com/login.php?next=https%3A%2F%2Fwww.facebook.com%2Fpokes
```

`npm start`로 실행해 보면 `/pokes` 페이지에 접속한 후 `/login.php` 페이지로 리다이렉트된 것을 확인할 수 있습니다.

### 로그인하기
우선 개발자 도구로 <https://www.facebook.com/login.php> 페이지의 구조를 확인해 봅시다.

{{< figure
  alt="Facebook 로그인 페이지"
  src="/images/phantomjs-facebook-autopoker/facebook-login.gif"
  caption="이거... 생각보다 일찍 끝나겠는데?" >}}

고맙게도 이번엔 필요한 세 요소에 전부 ID가 설정돼 있습니다. 이러면 굳이 복잡한 CSS 셀렉터를 고민하지 않아도 되죠. `document.getElementById` 메서드를 사용하면 간단하게 로그인을 하는 함수를 작성할 수 있습니다.

```js
function login (email, password) {
  var emailInput = document.getElementById('email')
  if (emailInput) emailInput.value = email

  var passwordInput = document.getElementById('pass')
  if (passwordInput) passwordInput.value = password

  var loginButton = document.getElementById('loginbutton')
  if (loginButton) loginButton.click()
}
```

### DOM 다루기

PhantomJS에서 DOM에 접근하려면 [`page.evaluate()`][Evaluate] 메서드에 실행할 코드를 함수로 전달해야 합니다. 이 때 전달된 함수는 샌드박스에서 실행되기 때문에 함수 바깥의 변수에 접근할 수 없다는 점에 유의하세요.

```js
// 2번째 인자부터는 login 함수의 파라미터로 전달됩니다
page.evaluate(login, "wow@doge.com", "p@ssw0rd")
```

### 현재 페이지 캡쳐하기
그럼 이제 로그인이 다 되었는지 볼까요? `page.render()` 메서드를 사용해 현재 열려 있는 페이지를 이미지로 확인할 수 있습니다. 로그인에 조금 시간이 걸리기 때문에 `setTimeout`으로 딜레이를 주는 걸 잊지 마세요.

```js
// 페이지 해상도를 FHD로 조정합니다
page.viewportSize = { width: 1920, height: 1080 }

// 10초 후 현재 디렉토리에 저장됩니다
setTimeout(function () { page.render('facebook.png') }, 10000)
```

현재 디렉토리에 생성된 `facebook.png` 파일을 열어 보면 콕 찔러보기 페이지로 이동된 것을 확인할 수 있습니다.

### 계정 정보 전달하기
로그인 잘 되는 것까지는 참 좋은데, 이메일과 비밀번호가 하드코딩된 게 좀 거슬립니다. 이럴 때 PhantomJS API의 [`system` 모듈][system.args]을 이용하면 프로그램 실행 시 전달된 인자로부터 깔끔하게 계정 정보들을 받아 올 수 있습니다.

```js
var args = require('system').args
page.evaluate(login, args[1], args[2])
```

## 자동으로 콕 찔러보기
```js
function getPokeBackButtons () {
  const root = document.getElementById('contentArea')
  const pokes = root.querySelector('div._4-u2._xct._4-u8:first-child')
  return [...pokes.querySelectorAll('a._42ft._4jy0._4jy3._4jy1.selected._51sy')]
}

setInterval(() => getPokeBackButtons().forEach(a => a.click()), 100)
```

1편에서 작성했던 자동으로 콕 찔러보기 코드, 기억나시나요? 안타깝게도 PhantomJS의 자바스크립트 엔진은 ES6 문법을 지원하지 않아서 이걸 바로 복붙할 수는 없습니다. [Babel]을 사용한다면 이 멋진 코드를 그대로 사용할 수 있지만, 일단은 [PhantomJS]에 맞도록 ES5 문법만을 사용해 다시 작성해 보겠습니다.

```js
function clickPokeBackButtons () {
  page.evaluate(function () {
    var root = document.getElementById('contentArea')
    var pokes = root.querySelector('div._4-u2._xct._4-u8:first-child')
    var list = pokes.querySelectorAll('a._42ft._4jy0._4jy3._4jy1.selected._51sy')

    Array.prototype.forEach.call(list, function (button) { button.click() })
  })
}

setInterval(clickPokeBackButtons, 100)
```

## 최종 코드: `autopoker.js`
```js
var args = require('system').args
var page = require('webpage').create()

page.viewportSize = { width: 1920, height: 1080 }
page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'

function login (email, password) {
  var emailInput = document.getElementById('email')
  if (emailInput) emailInput.value = email

  var passwordInput = document.getElementById('pass')
  if (passwordInput) passwordInput.value = password

  var loginButton = document.getElementById('loginbutton')
  if (loginButton) loginButton.click()
}

function clickPokeBackButtons () {
  page.evaluate(function () {
    var root = document.getElementById('contentArea')
    var pokes = root.querySelector('div._4-u2._xct._4-u8:first-child')
    var list = pokes.querySelectorAll('a._42ft._4jy0._4jy3._4jy1.selected._51sy')

    Array.prototype.forEach.call(list, function (button) { button.click() })
  })
}

function start (status) {
  console.log('status is ' + status)
  console.log('url is ' + page.url)

  setTimeout(function () {
    console.log('url is now ' + page.url)
    page.evaluate(login, args[1], args[2])

    setTimeout(function () {
      page.render('facebook.png')
      setInterval(clickPokeBackButtons, 100)

      console.log('now running!')
    }, 5000)
  }, 5000)
}

page.open('https://www.facebook.com/pokes', start)
```

끝! 드디어 페이스북 페이지를 열어 놓지 않아도 친구들을 마음껏 찌를 수 있게 되었습니다 :tada:

[Pokes]: https://www.facebook.com/pokes
[PhantomJS]: http://phantomjs.org
[Babel]: http://babeljs.io/
[Web Page]: http://phantomjs.org/api/webpage/
[Evaluate]: http://phantomjs.org/api/webpage/method/evaluate.html
[Wrapper]: https://github.com/Medium/phantomjs
[system.args]: http://phantomjs.org/api/system/property/args.html
[1편 코드]: {{< relref "phantomjs-facebook-autopoker-1.md#코드-작성하기" >}}
