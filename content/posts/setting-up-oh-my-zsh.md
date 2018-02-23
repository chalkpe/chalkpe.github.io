+++
menu = "main"
title = "bash 대신 zsh 사용하기"
date = 2018-02-24T03:42:41+09:00
tags = ["linux", "zsh", "tutorial"]
+++

{{< figure
  alt="Oh My Zsh"
  src="/images/setting-up-oh-my-zsh/main.png" >}}

## 설치하기
다음 명령어들을 입력한 후에 **로그아웃하고 다시 로그인**합니다.

```bash
sudo apt install curl zsh
chsh -s $(which zsh) # 앞에 sudo 붙이지 마세요
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

`~/.zshrc` 파일 맨 앞에 적혀 있는 `export PATH=$HOME/bin:/usr/local/bin:$PATH` 앞의 `#`을 제거해 주면 끝입니다.

## 커스터마이징

### 테마 설치하기
깔-끔한 [geometry](https://github.com/geometry-zsh/geometry)를 설치합니다.

```zsh
git clone https://github.com/geometry-zsh/geometry $ZSH_CUSTOM/themes/geometry
```

이것 외에도 추천하는 테마는 [Pure](https://github.com/sindresorhus/pure), [Bullet Train](https://github.com/caiogondim/bullet-train.zsh), [Spaceship](https://github.com/denysdovhan/spaceship-prompt) 등입니다. 다 마음에 안 드시면 [여기](https://github.com/robbyrussell/oh-my-zsh/wiki/External-themes)서 하나 찾아 보세요.

### 플러그인 설치하기
zsh 플러그인은 [정말 많지만](https://github.com/unixorn/awesome-zsh-plugins), 그 중에서 있으면 정말 편한 몇 개만 소개합니다. ~~많이 깔면 느려지거든요.~~

#### [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
명령어를 입력할 때, 기존에 입력한 명령어를 제안해주는 플러그인입니다.

```zsh
git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

#### [You Should Use](https://github.com/MichaelAquilina/zsh-you-should-use)
alias 설정을 해두고선 안 쓰고 있을 때 설정된 alias를 상기시켜 주는 플러그인입니다.

```zsh
git clone https://github.com/MichaelAquilina/zsh-you-should-use $ZSH_CUSTOM/plugins/you-should-use
```

#### [내장 플러그인들](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins)
| 플러그인 | 설명 |
| :-- | :-- |
| [git](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugin:git) | `gcam` (`git commit -a -m`) 등의 alias들을 추가해 줍니다 |
| [sudo](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins#sudo) | `ESC`를 두 번 치면 현재 입력 중인 명령어 앞에 `sudo `를 붙여 줍니다 |
| [common-aliases](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins#common-aliases) | `ll` (`ls -l`), `G` (<code>&#124; grep</code>) 등의 자주 쓰이는 alias들을 추가해 줍니다 |
| [command-not-found](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins#command-not-found) | 없는 명령어를 입력했을 때 뜨는 우분투의 추천 메세지를 다시 살려냅니다 |

#### 적용하기
`~/.zshrc` 파일을 열고, `plugins`와 `ZSH_THEME`의 값을 다음과 같이 수정해 주세요.

```zsh
ZSH_THEME="geometry/geometry"
plugins=(git sudo common-aliases command-not-found zsh-autosuggestions you-should-use)
```
