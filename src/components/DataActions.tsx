export const DataActions = ({ onCsv, onJson, onImport, onClear }: { onCsv: () => void; onJson: () => void; onImport: (file: File) => void; onClear: () => void }) => (
  <section className="card">
    <h2>データ管理</h2>
    <div className="button-group wrap">
      <button className="primary-button" onClick={onCsv}>CSV出力</button>
      <button className="secondary-button" onClick={onJson}>JSONエクスポート</button>
      <label className="secondary-button upload-button">
        JSONインポート
        <input type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
      </label>
      <button className="ghost-button danger" onClick={onClear}>全削除</button>
    </div>
  </section>
);
