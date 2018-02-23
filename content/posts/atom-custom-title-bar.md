+++
menu = "main"
title = "Atom 에디터 타이틀 바 커스터마이징하기"
date = 2018-02-12T15:32:36+09:00
tags = ["linux", "atom", "javascript"]
+++

{{< figure
  alt="customised Atom title bar"
  caption="app.asar 파일을 수정해 시스템 타이틀 바를 없앤 후, title-bar-replacer 패키지로 커스텀 타이틀 바를 추가한 모습!"
  src="/images/atom-custom-title-bar/after.png" >}}

## 설정하기

```bash
npm -g i asar
# 시작하기 전에 아톰 종료하기

cp /usr/share/atom/resources/app.asar ~ # 백업
asar e /usr/share/atom/resources/app.asar ~/atom.asar/

gedit ~/atom.asar/src/main-process/atom-window.js
# `title: 'Atom',` 검색한 후 그 옆에 `frame: false,` 추가

asar p ~/atom.asar/ ~/frameless.asar
sudo cp ~/frameless.asar /usr/share/atom/resources/app.asar
rm -rf ~/atom.asar/

apm i title-bar-replacer
cd ~/.atom/packages/title-bar-replacer/
npm i jQuery # https://github.com/sindrets/atom-title-bar-replacer/pull/25

atom <PROJECT>
# 에디터가 켜지면 title-bar-replacer 패키지의 컨피그를 취향대로 적당히 설정하세요
```

## 원래대로 돌리기
```bash
# 시작하기 전에 아톰 종료하기
apm rm title-bar-replacer
sudo cp ~/app.asar /usr/share/atom/resources/
```

{{< figure
  alt="default Atom title bar"
  caption="수정하기 전 모습. 에디터와 전혀 안 어울리는 회색 시스템 타이틀 바."
  src="/images/atom-custom-title-bar/before.png" >}}
