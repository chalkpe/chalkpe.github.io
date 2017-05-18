---
layout: post
title: 인스타그램 최근 게시글 검색 API 만들기
date: 2017-05-18 20:41:43 +0900
tags: [web, programming, javascript, phantomjs, instagram]
---

## 간단한 개요
- [Instagram]에서 특정 해시태그가 달려 있는 최근 게시물들을 받아오는 API가 필요함
- 공식 API를 찾아봤지만... 이건 쓰기가 너무나도 복잡해 보여서 빠르게 포기함
- 그냥 직접 하나 만들기로 하고 인스타그램 웹 페이지를 자세히 살펴 봄
- 역시나 React 기반이어서 [PhantomJS]로 크롤링을 할 수밖에 없는 상황이 됨
- 그래도 이번에는 [Babel] 돌려서 ES7 문법으로 깔끔하게 짜 보기로 함

## 프로젝트 틀 잡기
{% highlight bash %}
# package.json 생성
$ npm init

# PhantomJS
$ npm i --save phantomjs-prebuilt

# Babel CLI, env 및 stage-0 프리셋
$ npm i --save-dev babel-cli babel-preset-env babel-preset-stage-0

# 코드 스타일 검사
npm i --save-dev standard
{% endhighlight %}

설치가 끝나면 우리의 작업을 빠르고 편하게 해 줄 스크립트들을 추가합니다. 각각 `npm run compile` 커맨드는 ES7 문법으로 작성된 코드를 [PhantomJS]에서 돌아갈 수 있도록 변환해 주고, `npm start` 커맨드는 변환 후에 코드를 실행하며, `npm test` 커맨드는 먼저 코드 스타일을 검사한 후 코드를 변환해 줍니다.

{% highlight json %}
{
  ...
  "main": "index.js",
  "scripts": {
    "compile": "babel index.js -o phantom.js",
    "start": "npm run compile && phantomjs phantom.js",
    "test": "standard && npm run compile"
  }
  ...
}
{% endhighlight %}

마지막으로 `.babelrc` 파일을 작성합니다. `stage-0` 프리셋을 적용해서 끝내주는 ES7 문법을 사용할 수 있게 됐습니다.

{% highlight json %}
{ "presets": ["env", "stage-0"] }
{% endhighlight %}

## 작업 시작!
### CSS 셀렉터 확인하기
인스타그램에서 특정 해시태그로 검색하는 기능을 잘 활용하면 최근 게시글들을 받아올 수 있습니다. 이것저것 검색해 보며 URL을 확인해 보니 <https://www.instagram.com/explore/tags/태그/> 형식으로 되어 있는 게 딱 보이네요!

{%
  include image.html
  alt="Instagram tags"
  path="phantomjs-instagram-crawler/page.gif"
%}

자, 다시 페이지 구조를 살펴 보면 `article` 요소 바래 아래의 `div` 두 개 중 두 번째 게 우리가 필요한 **최근 게시글**들이 옹기종기 모여 있는 그리드입니다. CSS 셀렉터로 표현하면 `article > div:nth-of-type(2)`이 되죠.

{%
  include image.html
  alt="Instagram image tile"
  path="phantomjs-instagram-crawler/image.png"
%}

그리드 내부를 다시 자세히 보면, `a` 태그에 **게시글 링크**가 연결되어 있고, 그 안의 `img` 태그에 **게시글 내용**과 **이미지 링크**가 예쁘게 모여 있는 걸 볼 수 있습니다. 다만 `a` 태그의 경우, 맨 아래의 `Load more` 버튼까지 함께 선택될 수 있으므로 연결된 링크가 게시글인지 확인해 봐야 합니다. 최종적인 CSS 셀렉터는 `a[href^="/p/"] img`가 됩니다.

### PhantomJS 스크립트 작성하기
{% highlight js %}
/* eslint-env phantomjs */
import webpage from 'webpage'

const page = webpage.create() // 페이지 객체를 만들고, 최신 버전의 Chrome으로 둔갑합니다.
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

const tag = encodeURIComponent('디미고')
const url = 'https://www.instagram.com/explore/tags/' + tag

page.open(url, status => {
  if (status !== 'success') return phantom.exit(1)
  console.log(JSON.stringify(page.evaluate(parse), null, 2))
})

function parse () {
  // 최근 게시글 그리드의 셀들을 선택합니다
  const query = 'article > div:nth-of-type(2) a[href^="/p/"]'

  // NodeList 객체를 배열로 변환합니다
  const pictures = Array.prototype.slice.call(document.querySelectorAll(query))

  return pictures.map(a => {
    const img = a.querySelector('img[id^="pImage"]') // 셀 내의 이미지
    const text = img.getAttribute('alt') || '' // 개행 문자가 포함될 수 있음

    return {
      text, // 게시글 내용
      image: img.getAttribute('src'), // 이미지 링크
      link: 'https://www.instagram.com' + a.getAttribute('href'), // 게시글 링크
      tags: (text.match(/#([^\s#]+)/g) || []).map(tag => tag.slice(1)) // 태그 목록
    }
  })
}
{% endhighlight %}

`npm start` 커맨드로 실행해 보면 깔끔하게 크롤링이 된 걸 확인할 수 있습니다.

## 문제점의 발견
일단 `#디미고` 태그를 검색하는 것까지는 성공했습니다. 그런데, 다른 태그를 검색하려면 코드를 매번 수정해 줘야 하는 걸까요? 저번과는 다르게 API를 제공해 줘야 하기 떄문에 `system.args`를 이용하기에도 애매한 상황입니다.

## webserver 모듈 활용하기
다행히도 [PhantomJS] API에서 [webserver] 모듈을 제공해 주고 있습니다. 아직 `EXPERIMENTAL` 상태이긴 하지만, 뭐 어때요! 웹 서버를 만들어서 원하는 태그를 마음껏 검색할 수 있게 개조해 봅시다.

{% highlight js %}
/* eslint-env phantomjs */
import webpage from 'webpage'
import webserver from 'webserver'

webserver.create().listen(2409, (req, res) => {
  if (req.url === '/favicon.ico') return // 파비콘 같은 건 사치입니다

  const page = webpage.create() // 페이지 객체를 만들고, 최신 버전의 Chrome으로 둔갑합니다.
  page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

  console.log(decodeURIComponent(req.url)) // 인코딩된 태그의 원래 내용을 보여줍니다
  res.setHeader('Content-Type', 'application/json') // API는 역시 JSON으로 보내 주는 게 최고!

  page.open('https://www.instagram.com/explore/tags' + req.url, status => {
    if (status !== 'success') {
      res.statusCode = 500
      res.write(JSON.stringify({
        ok: false,
        message: `Unable to load ${req.url}`
      }))

      return res.close()
      // phantom.exit(1)에서 HTTP 500 에러를 보내는 것으로 변경했습니다
    }

    res.statusCode = 200
    res.write(JSON.stringify({
      ok: true,
      date: new Date(),
      result: page.evaluate(parse)
    }))

    res.close()
    // JSON을 콘솔에 출력하는 것에서 HTTP 200 응답을 보내는 것으로 변경했습니다
  })
})

function parse () {
  // 최근 게시글 그리드의 셀들을 선택합니다
  const query = 'article > div:nth-of-type(2) a[href^="/p/"]'

  // NodeList 객체를 배열로 변환합니다
  const pictures = Array.prototype.slice.call(document.querySelectorAll(query))

  return pictures.map(a => {
    const img = a.querySelector('img[id^="pImage"]') // 셀 내의 이미지
    const text = img.getAttribute('alt') || '' // 개행 문자가 포함될 수 있음

    return {
      text, // 게시글 내용
      image: img.getAttribute('src'), // 이미지 링크
      link: 'https://www.instagram.com' + a.getAttribute('href'), // 게시글 링크
      tags: (text.match(/#([^\s#]+)/g) || []).map(tag => tag.slice(1)) // 태그 목록
    }
  })
}
{% endhighlight %}

API 서버 완성! <http://localhost:2409/wow>에 접속하면 `#wow` 태그에 해당되는 내용을 보내 줍니다!

[PhantomJS]: http://phantomjs.org/
[Instagram]: https://www.instagram.com/
[Babel]: http://babeljs.io/
[webserver]: http://phantomjs.org/api/webserver/
