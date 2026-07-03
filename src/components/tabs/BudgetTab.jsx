import { useEffect, useState } from 'react'

const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

function toWesternDigits(value) {
  return value.replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC_DIGITS.indexOf(d)))
}

// يستخرج رقمًا من نص المبلغ القادم من الذكاء الاصطناعي (قد يكون رقمًا مفردًا أو نطاقًا مثل "400-600")
function parseAmount(raw) {
  if (raw == null) return null
  const normalized = toWesternDigits(String(raw)).replace(/,/g, '')
  const matches = normalized.match(/\d+(\.\d+)?/g)
  if (!matches?.length) return null
  const numbers = matches.map(Number)
  return numbers.length === 1 ? numbers[0] : (Math.min(...numbers) + Math.max(...numbers)) / 2
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

export default function BudgetTab({ budget }) {
  const items = budget?.items || []
  const [checked, setChecked] = useState(() => items.map(() => true))

  useEffect(() => {
    setChecked((budget?.items || []).map(() => true))
  }, [budget])

  if (!budget) return null

  const toggle = (index) => {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)))
  }

  const selectedTotal = items.reduce((sum, item, i) => {
    if (!checked[i]) return sum
    const value = parseAmount(item.amount)
    return value == null ? sum : sum + value
  }, 0)

  const hasUnparsable = items.some((item, i) => checked[i] && parseAmount(item.amount) == null)

  return (
    <div className="tab-panel">
      <table className="budget-table">
        <thead>
          <tr>
            <th className="checkbox-col"></th>
            <th>البند</th>
            <th>المبلغ</th>
            <th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className={checked[i] ? '' : 'budget-row-off'}>
              <td className="checkbox-col">
                <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
              </td>
              <td>{item.category}</td>
              <td>
                {item.amount} {budget.currency}
              </td>
              <td className="notes-cell">{item.notes}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="checkbox-col"></td>
            <td>الإجمالي المقترح (كل البنود)</td>
            <td colSpan={2}>
              {budget.total} {budget.currency}
            </td>
          </tr>
          <tr className="budget-selected-row">
            <td className="checkbox-col"></td>
            <td>إجمالي البنود المفعّلة</td>
            <td colSpan={2}>
              {formatNumber(selectedTotal)} {budget.currency}
            </td>
          </tr>
        </tfoot>
      </table>
      {hasUnparsable && (
        <p className="notes">بعض البنود المفعّلة مبلغها غير رقمي بوضوح ولم تُحتسب ضمن الإجمالي أعلاه.</p>
      )}
    </div>
  )
}
