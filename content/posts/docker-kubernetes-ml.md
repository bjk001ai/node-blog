---
title: "Docker와 Kubernetes를 활용한 ML 모델 서빙 인프라 구축"
date: "2026-05-23"
tags: ["mlops","migration"]
excerpt: "쿠버네티스(K8s) 상에서 대규모 AI 모델 안정적으로 운영하기 사용자의 예측 요청이 갑자기 폭증할 때, 하나의 가상 서버에 올라간 딥러닝 모델은 과부하로 죽고 맙니다. MLOps..."
slug: "docker-kubernetes-ml"
---

# 쿠버네티스(K8s) 상에서 대규모 AI 모델 안정적으로 운영하기

사용자의 예측 요청이 갑자기 폭증할 때, 하나의 가상 서버에 올라간 딥러닝 모델은 과부하로 죽고 맙니다. MLOps 아키텍트가 선택하는 표준 아키텍처는 **Docker**로 모델을 패키징하고 **Kubernetes**로 자동 확장(Auto-scaling)을 제어하는 구조입니다.

## 1. 모델 서빙의 컨테이너화

모델 학습을 마치면 학습된 가중치 파일(e.g., `.onnx`, `.pt`, `.bin`)과 예측 웹 프레임워크(Triton Server, FastAPI)를 Dockerfile 하나로 통합하여 불변의 컨테이너 이미지로 빌드합니다.

---

## 2. Kubernetes 기반 오케스트레이션 설계

- **HPA (Horizontal Pod Autoscaler)**: CPU/GPU 사용량이나 동시 요청 수에 따라 Pod(컨테이너 실행 단위) 개수를 탄력적으로 늘려 트래픽 폭증을 완화합니다.
- **Kubernetes 스케줄러**: GPU 리소스를 효율적으로 분배하고 멀티 노드 클러스터 전역에 모델을 적절하게 분산 배치합니다.
