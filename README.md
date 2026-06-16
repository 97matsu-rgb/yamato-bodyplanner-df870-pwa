# YAMATO BodyPlanner DF870 PWA

YAMATO BodyPlanner DF870 のQRコードを読み取り、体組成データを端末内 IndexedDB に保存・可視化・分析する React + TypeScript + Vite 製のPWAです。

## 技術スタック
- React
- TypeScript
- Vite
- IndexedDB
- Chart.js
- html5-qrcode
- vite-plugin-pwa

## セットアップ
```bash
npm install
npm run dev
```

## ビルド
```bash
npm run build
```

## 主な機能
- QRコード読み取りによる測定データ追加
- 最新測定結果 / 前回比 / モチベーションメッセージ
- 測定履歴、個別削除、全削除
- 総合グラフ / 個別グラフ
- 目標設定、予測達成日、信頼度、次回予測、達成確率
- バッジシステム、紙吹雪アニメーション、振動演出
- CSV出力、JSONバックアップ / 復元
- オフライン利用可能なPWA
