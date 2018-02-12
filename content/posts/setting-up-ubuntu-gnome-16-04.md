+++
menu = "main"
title = "Ubuntu GNOME 16.04 설치하기"
date = 2018-02-11T22:58:16+09:00
tags = ["linux", "tutorial"]
+++

{{< figure
  alt="Ubuntu GNOME 16.04"
  src="/images/setting-up-ubuntu-gnome-16-04/main.png"
  caption="(GitHub Universe 2015 배경화면 사용 중)" >}}

## 설치하기에 앞서

### 어째서 이 배포판을?
우분투 17.10부터 [유니티에서 GNOME으로 데스크톱 환경이 바뀐다는 소식](https://www.ubuntu.com/desktop/1710)을 듣고 17.10을 몇 차례 써 봤었는데요. GNOME 환경이 확실히 유니티보다 더 예쁘고, 커스터마이징도 쉬운데다 쓰기에도 편해서 GNOME을 쓰기로 마음먹었는데...

1. 일단 17.10은 **LTS 버전**이 아니라서 왠지 불안하고
1. Wayland 호환이 안 되는 프로그램들이 많아서 귀찮고
1. ~~끔찍한 디자인의~~ Ambiance 기본 테마가 마음에 안 들어서

이 세 가지를 모두 해결해 주는 우분투 GNOME 16.04.3 LTS 버전을 선택하게 됐습니다.

### USB 굽기
늘 하던대로 [우분투 ISO 파일](https://wiki.ubuntu.com/UbuntuGNOME/GetUbuntuGNOME)을 다운로드하고, [Rufus](https://rufus.akeo.ie/)를 받아서 USB를 구워 줍니다. 여기까지는 괜찮아요.

### 고통의 시작
{{< figure width="300px"
  alt="Fuck you, NVIDIA!"
  src="/images/setting-up-ubuntu-gnome-16-04/torvalds-f-you-nvidia.jpg"
  caption="토발즈 아저씨가 이미 욕한 NVIDIA입니다" >}}

그런데 ~~시발~~ 제 노트북에 들어있는 그래픽 카드가 **NVIDIA GeForce GTX 960M**이라서요... 엔당의 고질적인 드라이버 문제 때문에 그냥 켜면 [영원히 부팅 화면에서 멈춰 버립니다](https://twitter.com/amato17/status/956233588172713984).

GRUB 커널 부트 옵션에서 `acpi=off` 아니면 `nomodeset`을 `quiet splash` 근처에 추가하면 해결되는데, 부팅 중에 `ESC` 키를 누르고 `F6` 키를 누르면 [관련 설정](https://twitter.com/amato17/status/961992971355701248)을 간단하게 할 수 있어요. 정상적으로 부팅된 후엔 편안하게 설치할 파티션을 고르고 [하스스톤](https://playhearthstone.com) 한 판 하고 오시면 됩니다. ~~어그로 덱은 4판은 돌려야 끝나니까 재미있고 클린한 컨덱 하세요~~

## 설치 후에 할 일
일단 업그레이드를 하기 전에, 느려터진 기본 저장소를 다음카카오 미러로 변경합시다.

```bash
gksudo gedit /etc/apt/sources.list
# `kr.archive.ubuntu.com`을 검색해서 전부 `ftp.daumkakao.com`으로 바꿔줍시다

sudo apt update && sudo apt upgrade
```

### 필수 패키지 설치
없어서는 안 되는 수많은 패키지들의 PPA를 추가하고 몽땅 다 깔아줍시다. 중간중간에 스팀이나 자바 등등은 라이선스 동의하냐면서 멈춰버리니까 자리를 비우면 안 돼요...

```bash
sudo add-apt-repository ppa:numix/ppa                    # Numix (GNOME 테마)
sudo add-apt-repository ppa:webupd8team/java             # Java 9
sudo add-apt-repository ppa:gnome3-team/gnome3-staging   # GNOME 3.20

# mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

# nodejs
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -

# yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update
sudo apt install -y steam oracle-java9-installer git vim redis-server gnome-tweak-tool fcitx fcitx-hangul mongodb-org nodejs yarn numix-*
sudo apt upgrade && sudo apt autoremove
```

### APT로 설치하기 귀찮은 것들 설치
[Telegram Desktop](https://desktop.telegram.org)의 경우에는 다운로드해서 압축을 푼 후에 `chmod +x ./Telegram && ./Telegram`으로 실행해 줍니다. 처음에는 켜지는 게 좀 오래 걸려요. ~~묵직한~~ [Atom](https://atom.io), [Discord](https://discord.gg), [Google Chrome](https://www.google.com/chrome/) 등은 `.deb` 파일을 다운로드한 후에 다음 명령어를 쳐 줍시다.

```bash
sudo dpkg -i ~/Downloads/*.deb
sudo apt install -f # 의존성 오류가 떴다면 해결해서 다시 설치해 줍니다
```

### 커스터마이징
:tada: 달려 있는 건 설치하지 않으면 정말 불편한 것들이니까 꼭 설치하는 게 좋아요.

| 익스텐션 | 설명 |
| :--: | :--- |
| [TopIcons Plus] :tada: | 탑바에 트레이 아이콘을 표시해 줌 |
| [Dash to Dock] :tada: | 화면 구석에 독(작업 표시줄 같은 것)을 고정해 줌 |
| [No Title Bar] | 창을 최대화했을 때 타이틀 바를 없애고 탑바에 제목을 표시해 줌 |
| [OpenWeather] | 탑바에 날씨 정보를 표시해 줌 |
| [Freon] | 탑바에 하드웨어 온도를 표시해 줌 |
| [NetSpeed] | 탑바에 현재 인터넷 속도를 표시해 줌 |
| [Clipboard Indicator] | 탑바에 최근 클립보드 내용을 표시해 줌 |
| [Dynamic Panel Transparency] | 탑바를 투명하게 만들어 줌 |
| [Media Player Indicator] | 음악 재생 컨트롤러를 메뉴에 추가해 줌 |
| [Sound Input & Output Device Chooser] | MIDI/스피커 등 소리 입출력 기기 선택을 메뉴에 추가해 줌 |

[Dash to Dock]: https://extensions.gnome.org/extension/307/dash-to-dock/
[Media Player Indicator]: https://extensions.gnome.org/extension/55/media-player-indicator/
[OpenWeather]: https://extensions.gnome.org/extension/750/openweather/
[TopIcons Plus]: https://extensions.gnome.org/extension/1031/topicons/
[NetSpeed]: https://extensions.gnome.org/extension/104/netspeed/
[Sound Input & Output Device Chooser]: https://extensions.gnome.org/extension/906/sound-output-device-chooser/
[Freon]: https://extensions.gnome.org/extension/841/freon/
[Clipboard Indicator]: https://extensions.gnome.org/extension/779/clipboard-indicator/
[No Title Bar]: https://extensions.gnome.org/extension/1267/no-title-bar/
[Dynamic Panel Transparency]: https://extensions.gnome.org/extension/1011/dynamic-panel-transparency/

전부 다 설치했다면 `gnome-tweak-tool`을 켜고

1. `Top Bar` 메뉴에서 `Show date`와 `Show seconds` 체크
1. `Extensions` 메뉴에서 적당히 익스텐션 옵션 커스터마이징
1. `Appearance` 메뉴에서 `GTK+` 테마는 `Numix`, `Icons` 테마는 `Numix-Circle`로 변경
1. `Typing` - `Korean Hangul/Hanja keys` - `Right Alt as Hangul, Right Ctrl as Hanja` 체크

{{< figure
  alt="Right Alt as Hangul, Right Ctrl as Hanja"
  src="/images/setting-up-ubuntu-gnome-16-04/hangul-tweak.png" >}}

### 한글 입력하기
1. `im-config -n fcitx` 명령어 입력 후 로그아웃했다 다시 로그인
2. 트레이 리스트에 키보드 모양 아이콘 <img class="inline" src="/images/setting-up-ubuntu-gnome-16-04/fcitx.png"> 우클릭 - `Configure` 클릭
3. 창 하단의 `+` 버튼 클릭 - `Only Show Current Language` 체크 해제 - `Hangul` 검색 후 추가
4. `Global Config` 탭 클릭 - `Trigger Input Method`의 두번째 버튼 클릭 - `한/영` 키 누르기 (`Hangul`로 입력됐다면 성공)

#### 세미콜론 누를 때마다 뜨는 '그 창' 없애기
`Addon` 탭 클릭 - `Quickphrase` 선택 - `Configure` 버튼 클릭 - `Trigger Key for QuickPhrase`를 `None`으로 변경

#### 한글 모드로 전환하면 조그맣게 뜨는 `Hangul` 창 없애기
1. `Global Config` 탭 클릭
2. `Show Advance Option` 체크
3. `Appearance` 탭 클릭
4. `Show Input Method Hint After Input method changed` 체크 해제

### 윈도우로 부팅하면 시스템 시간이 9시간 어긋나는 문제 해결하기
* 리눅스는 UTC로 시스템 시간을 저장하고, 윈도우는 로컬 타임으로 저장해서 발생하는 문제
* 윈도우가 UTC를 쓰게 하는 건 레지스트리 편집해야 해서 귀찮으니까... 편하게 리눅스를 바꿉시다

```bash
timedatectl set-local-rtc 1
```
