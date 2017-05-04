---
layout: post
title: PhantomJS로 "Facebook 콕 찔러보기" 자동화하기 (#2)
date: 2017-05-01 16:52:11 +0900
tags: [web, programming, javascript]
---

## 개요
[1편에서 만들었던 짧은 코드][1편 코드]는 성공적으로 친구들을 콕 찔러 줬지만, 브라우저를 내내 켜 놓고 있어야만 한다는 문제가 있었습니다. 그래서, [PhantomJS]라는 헤드리스 브라우저로 이 문제를 해결해 보겠다는 게 이번 포스트의 목표입니다.

## PhantomJS 설치
[직접 설치할 수도 있지만](http://phantomjs.org/download.html), 어떤 플랫폼이든 상관없이 간단하게 [PhantomJS]를 설치해 주는 `phantomjs-prebuilt` [래퍼][Medium/phantomjs]를 이용하도록 하겠습니다. 다음 명령들을 콘솔에 복붙하고 [노래](https://youtu.be/h--P8HzYZ74)나 한 곡 듣고 계세요 ㅎㅎ.

{% highlight bash %}
mkdir facebook-autopoker
cd facebook-autopoker && npm init
npm install --save phantomjs-prebuilt
{% endhighlight %}

## 만들어야 할 것들
우선 우리 PhantomJS가 해야 할 일은

1. <https://www.facebook.com/pokes> 페이지에 접속한다.
1. 로그인 페이지가 뜬다면 적절히 이메일과 비밀번호를 입력해 로그인한다.
1. 콕 찔러보기 페이지로 리다이렉트되면 **나도 콕 찔러보기** 버튼이 보이는 족족 계속 눌러 준다.

정도입니다. 중요한 건 이 모든 작업이 수행되는 곳이 내 브라우저의 페북 페이지가 아니라는 거죠!

## PhantomJS로 Facebook 로그인하기
고통과 인내의 시간이 다시 돌아왔습니다. 일단 우리가 해야 할 건

1. 이메일 칸에 사용자 이메일 입력하기
1. 비밀번호 칸에 사용자 비밀번호 입력하기
1. 다 입력하고 나서 로그인 버튼 누르기

이렇게 세 가지입니다. <https://www.facebook.com/pokes> 페이지에 접속하고 F12를 눌러 게임을 시작해 보죠.

{%
  include image.html
  alt="Facebook 로그인 페이지"
  path="phantomjs-facebook-autopoker/facebook-login.gif"
  caption="이거, 생각보다 일찍 끝나겠는데?"
%}

고맙게도 이번엔 필요한 세 요소에 전부 ID가 설정돼 있어서 굳이 CSS 셀렉터를 고민하지 않아도 됩니다. 바로 써 보죠.


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

[PhantomJS]: http://phantomjs.org
[Medium/phantomjs]: https://github.com/Medium/phantomjs
[1편 코드]: {% link _posts/2017-04-25-phantomjs-facebook-autopoker-1.md %}#코드-작성하기
