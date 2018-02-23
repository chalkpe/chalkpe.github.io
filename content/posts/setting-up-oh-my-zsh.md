+++
menu = "main"
title = "Bash 대신 Zsh 사용하기"
date = 2018-02-24T01:08:23+09:00
tags = ["linux", "zsh", "tutorial"]
draft = true
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
