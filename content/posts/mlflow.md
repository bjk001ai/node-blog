---
title: "MLflow로 실험 추적 및 모델 레지스트리 구축하기"
date: "2026-05-23"
tags: ["mlops","migration"]
excerpt: "MLflow: 머신러닝 실험 로깅과 모델 버전 제어 플랫폼 머신러닝 엔지니어들은 수백 번의 실험을 반복하면서 수많은 하이퍼파라미터와 평가 지표(Accuracy, Loss, F1)를..."
slug: "mlflow"
---

# MLflow: 머신러닝 실험 로깅과 모델 버전 제어 플랫폼

머신러닝 엔지니어들은 수백 번의 실험을 반복하면서 수많은 하이퍼파라미터와 평가 지표(Accuracy, Loss, F1)를 비교합니다. 이를 엑셀이나 수기로 기록하는 대신 **MLflow**를 사용하면 클릭 한 번으로 모든 기록을 저장하고 시각화할 수 있습니다.

## 1. MLflow 핵심 구성 요소

1. **MLflow Tracking**: 모델 학습 중 파라미터, 성능 지표, 아티팩트(모델 파일, 가중치 그래프)를 자동으로 서버에 기록합니다.
2. **MLflow Models**: 다양한 프레임워크(Scikit-Learn, PyTorch, TensorFlow)로 제작된 모델을 표준 규격 포맷으로 저장하여 서빙 호환성을 높입니다.
3. **MLflow Model Registry**: 팀 단위 협업 시 어떤 모델이 현재 배포 대기(Staging) 상태이고 프로덕션(Production) 상태인지 라이프사이클 버전을 안전하게 기록/승인 관리합니다.
