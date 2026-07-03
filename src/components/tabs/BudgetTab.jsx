export default function BudgetTab({ budget }) {
  if (!budget) return null

  return (
    <div className="tab-panel">
      <table className="budget-table">
        <thead>
          <tr>
            <th>البند</th>
            <th>المبلغ</th>
            <th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {budget.items?.map((item, i) => (
            <tr key={i}>
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
            <td>الإجمالي</td>
            <td colSpan={2}>
              {budget.total} {budget.currency}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
