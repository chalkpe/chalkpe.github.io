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


[PhantomJS]: http://phantomjs.org
[Medium/phantomjs]: https://github.com/Medium/phantomjs
[1편 코드]: {% link _posts/2017-04-25-phantomjs-facebook-autopoker-1.md %}#코드-작성하기
