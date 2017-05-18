---
layout: post
title: 인스타그램 최근 게시글 검색 API 만들기
date: 2017-05-18 20:41:43 +0900
tags: [web, programming, javascript, phantomjs, instagram]
---

## 개요
- [Instagram]에서 특정 해시태그가 달려 있는 최근 게시물들을 받아오는 API가 필요함
- 공식 API를 찾아봤지만... 이건 쓰기가 너무나도 복잡해 보여서 빠르게 포기함
- 그냥 직접 하나 만들기로 하고 인스타그램 웹 페이지를 자세히 살펴 봄
- 역시나 React 기반이어서 [PhantomJS]로 크롤링을 할 수밖에 없는 상황이 됨
- 그래도 이번에는 Babel 돌려서 ES7 문법으로 깔끔하게 짜 보기로 함

[PhantomJS]: http://phantomjs.org/
[Instagram]: https://www.instagram.com/
