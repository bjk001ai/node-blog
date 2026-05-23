---
title: "AWS EC2 기초 및 서버 인스턴스 구축하기"
date: "2026-05-23"
tags: ["aws","migration"]
excerpt: "AWS EC2 (Elastic Compute Cloud) 기초 완벽 실습 클라우드 컴퓨팅의 기본은 독립된 가상 서버를 대여하여 원하는 환경을 구축하는 것입니다. AWS EC2는 가..."
slug: "aws-ec2"
---

# AWS EC2 (Elastic Compute Cloud) 기초 완벽 실습

클라우드 컴퓨팅의 기본은 독립된 가상 서버를 대여하여 원하는 환경을 구축하는 것입니다. AWS EC2는 가장 대표적인 가상 서버 서비스입니다. 이번 가이드에서는 EC2 인스턴스를 생성하고 접속하는 전 과정을 상세히 다룹니다.

## 1. EC2 핵심 개념 이해하기

- **인스턴스(Instance)**: AWS 클라우드에서 실행되는 가상 컴퓨터 서버입니다.
- **AMI (Amazon Machine Image)**: 서버 OS 및 초기 기본 소프트웨어가 미리 세팅된 가상 이미지입니다. (e.g. Ubuntu 22.04 LTS, Amazon Linux 2023)
- **보안 그룹 (Security Group)**: 가상 방화벽으로, 허용할 IP와 포트를 제어하는 인바운드/아웃바운드 규칙을 정의합니다.
- **키 페어 (Key Pair)**: 가상 서버에 SSH 접속을 하기 위한 암호화된 비밀키(Private Key, .pem/.ppk)입니다.

---

## 2. EC2 인스턴스 생성 (Launch Instance) 절차

1. **AWS 콘솔** 로그인 후 **EC2 대시보드**로 이동합니다.
2. **[인스턴스 시작 (Launch Instance)]** 버튼을 클릭합니다.
3. **이름 및 태그**를 입력합니다. (e.g. `Bong-Tech-Blog-Server`)
4. **AMI 선택**: OS로 **Ubuntu Server 22.04 LTS**를 선택합니다.
5. **인스턴스 유형**: 프리티어 등급인 **t2.micro** 또는 **t3.micro**를 선택합니다.
6. **키 페어 생성**: 새 키 페어를 생성하고 `.pem` 파일을 로컬 컴퓨터에 안전하게 저장합니다. (분실 시 접속 불가!)
7. **네트워크 설정 (보안 그룹)**:
   - **SSH 허용 (22포트)**: 자신의 IP만 허용하도록 설정합니다.
   - **HTTP (80포트) 및 HTTPS (443포트) 허용**: 외부 클라이언트의 웹 접속을 위해 허용합니다.
8. **인스턴스 시작** 버튼을 클릭하여 인스턴스를 활성화합니다.

---

## 3. SSH를 통한 EC2 서버 접속 방법 (Windows/Mac)

### 3.1 Mac & Linux 터미널
``.pem`` 파일이 다운로드된 디렉토리로 이동하여 아래 명령어를 실행합니다.

```bash
# 1. 키 파일 권한 변경 (소유자 읽기 전용)
chmod 400 your-key-pair.pem

# 2. Public IP를 사용하여 SSH 접속
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
```

### 3.2 Windows PowerShell
PowerShell을 열고 동일하게 실행합니다.

```powershell
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
```

---

## 4. 기본적인 웹 서버(Nginx) 구성해보기

EC2에 정상 접속했다면, 기본적인 웹 서버를 띄워 외부에서 브라우저를 통해 정상적으로 들어올 수 있는지 테스트합니다.

```bash
# 1. 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# 2. Nginx 웹 서버 설치
sudo apt install nginx -y

# 3. Nginx 서비스 실행 및 활성화
sudo systemctl start nginx
sudo systemctl enable nginx
```

설치 완료 후 브라우저 주소창에 EC2의 **퍼블릭 IP**를 입력하고 접속하면, 멋진 **"Welcome to nginx!"** 기본 페이지를 볼 수 있습니다!

EC2 인스턴스는 자유도가 매우 높아 Node.js, Spring Boot, Python, Docker 등 원하는 모든 백엔드 서버를 배포할 수 있는 초석이 됩니다.
