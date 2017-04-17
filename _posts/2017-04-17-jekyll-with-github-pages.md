---
layout: post
title: "GitHub Pages: Jekyll 블로그 만들기"
date: 2017-04-17 22:38:20 +0900
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

{% highlight bash %}
$ gem install jekyll bundler
$jekyll new chalkboard

$ cd chalkboard
$ bundle exec jekyll serve
{% endhighlight %}

이름이 `chalkboard`인 새 블로그를 하나 만들었습니다. <http://localhost:4000>에 접속해 보면 깔끔한 블로그 하나가 만들어져 있는 걸 확인할 수 있습니다.

## _config.yml 편집하기
우선 블로그 제목 등의 기본적인 설정을 수정합니다.

`description`의 경우 여러 줄에 걸쳐서 쓰는 게 편한 경우가 있는데, 그럴 때에는 `description: ` 뒤에 `>`를 붙이면 그 뒤의 글들의 줄바꿈이 무시됩니다. 또, `timezone` 값을 자기가 사는 곳으로 설정하고 싶다면 [여기](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)에서 찾아 보세요. 보통의 경우는 `Asia/Seoul`로 설정하면 됩니다. `*_username`의 경우 계정이 없다면 안 써도 됩니다.

{% highlight yml %}
title: Chalkboard
description: >
  다시는 반복하고 싶지 않은 끔찍한 상황들의
  적절한 해결 방법을 기록해 두는 작은 블로그
  
email: chalk@chalk.pe
timezone: Asia/Seoul
encoding: utf-8

twitter_username: amato17
github_username:  ChalkPE
{% endhighlight %}

그 다음으로, 블로그 주소를 설정합니다. 깃허브 페이지에서 호스팅할 것이기 때문에 전 이렇게 설정했습니다.

{% highlight yml %}
baseurl: ""
url: "https://chalkpe.github.io"
{% endhighlight %}

마지막으로, Jekyll에서는 댓글을 직접 처리할 수 없기에 [Disqus](https://disqus.com/admin/create/)를 이용합니다. 사이트를 생성하고 [shortname](https://help.disqus.com/customer/portal/articles/466208)을 확인해서 아래와 같이 설정하세요.

{% highlight yml %}
disqus:
  shortname: chalkboard-1
{% endhighlight %}

마지막으로 방문자 집계를 위한 [구글 애널리틱스](http://analytics.google.com/) 설정입니다. 알아서 하세요.

{% highlight yml %}
google_analytics: UA-97499484-1
{% endhighlight %}

## 끝!
[b.chalk.pe](https://b.chalk.pe)에 성공적으로 Jekyll 블로그를 만들었습니다!