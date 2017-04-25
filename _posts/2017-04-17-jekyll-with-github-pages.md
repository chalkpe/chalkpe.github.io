---
layout: post
title: GitHub Pages에 Jekyll 블로그 만들기
tags: [blog, jekyll]
---

## RubyGems 설치하기
로컬에서 Jekyll 블로그를 빌드해 보려면 Ruby 개발 환경이 필요합니다. [rbenv](https://github.com/rbenv/rbenv)를 이용해 Ruby 2.4.1 버전과 gem을 동시에 설치합니다.

{% highlight bash %}
$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
$ cd ~/.rbenv && src/configure && make -C src
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
$ rbenv install 2.4.1
{% endhighlight %}

## 로컬에서 Jekyll 블로그 만들기
RubyGems를 이용해서 Jekyll과 Bundler를 설치하고, 이름이 `chalkboard`인 블로그를 하나 만듭니다.
{% highlight bash %}
$ gem install jekyll bundler
$ jekyll new chalkboard && cd chalkboard
$ bundle exec jekyll serve
{% endhighlight %}

<http://localhost:4000>에 접속해 보면 깔끔한 블로그 하나가 만들어져 있는 걸 확인할 수 있습니다.

## \_config.yml 편집하기
우선 블로그 제목 등의 기본적인 설정을 수정합니다. `description: ` 뒤에 `>`를 붙이면 설명을 여러 줄에 걸쳐서 쓸 수 있습니다.

{% highlight yml %}
title: Chalkboard
description: >
  다시는 반복하고 싶지 않은 끔찍한 상황들의
  적절한 해결 방법을 기록해 두는 작은 블로그

encoding: utf-8
email: chalk@chalk.pe
{% endhighlight %}

`timezone`은 [여기](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)를 참고해서 설정합니다. `twitter_username`이나 `github_username`은 계정이 없다면 안 써도 됩니다.

{% highlight yml %}
timezone: Asia/Seoul
github_username: ChalkPE
twitter_username: amato17
{% endhighlight %}

그 다음으로, 블로그 주소를 설정합니다. 깃허브 페이지에서 호스팅할 것이기 때문에 전 이렇게 설정했습니다.

{% highlight yml %}
baseurl: ""
url: "https://chalkpe.github.io"
{% endhighlight %}

Jekyll에서는 댓글을 직접 처리할 수 없기에 [Disqus](https://disqus.com/admin/create/)를 이용합니다. 사이트를 생성하고 [shortname](https://help.disqus.com/customer/portal/articles/466208)을 확인해서 아래와 같이 설정하세요.

{% highlight yml %}
disqus:
  shortname: chalkboard-1
{% endhighlight %}

마지막으로 방문자 집계를 위한 [Google Analytics](http://analytics.google.com/) 설정입니다. `UA-000000-2` 형태의 [Tracking ID](https://support.google.com/analytics/answer/1008080)를 확인하고 다음과 같이 설정하세요.

{% highlight yml %}
google_analytics: UA-97499484-1
{% endhighlight %}

## 글 쓰기
`/_posts` 폴더에 `2017-04-17-hello-world.md` 파일을 만들고, 다음 내용을 입력합니다.

{% highlight markdown %}
---
layout: post
title: Hello, world!
date: 2017-04-17 23:30
categories: blog
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
{% endhighlight %}

`bundle exec jekyll serve` 명령을 다시 실행하고 <http://localhost:4000>에 접속해 보면 성공적으로 글이 올라온 것을 확인할 수 있습니다.
