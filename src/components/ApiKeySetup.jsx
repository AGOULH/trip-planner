import { useState } from 'react'

export default function ApiKeySetup({ apiKey, onSave }) {
  const [value, setValue] = useState(apiKey)
  const [visible, setVisible] = useState(false)

  return (
    <div className="card api-key-card">
      <h2>مفتاح Anthropic API</h2>
      <p className="muted">
        يُستخدم مفتاحك لإنشاء خطة الرحلة عبر Claude، ويُحفظ في متصفحك فقط ولا يُرسل لأي جهة أخرى.
      </p>
      <div className="api-key-row">
        <input
          type={visible ? 'text' : 'password'}
          placeholder="sk-ant-..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          dir="ltr"
        />
        <button type="button" className="btn-secondary" onClick={() => setVisible((v) => !v)}>
          {visible ? 'إخفاء' : 'إظهار'}
        </button>
        <button type="button" className="btn-primary" onClick={() => onSave(value.trim())} disabled={!value.trim()}>
          حفظ
        </button>
      </div>
    </div>
  )
}
