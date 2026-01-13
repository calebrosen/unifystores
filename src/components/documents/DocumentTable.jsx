import MediumButton from "../buttons/MediumButton";

export default function DocumentTable({ rows, onEdit }) {
  if (!rows || rows.length === 0) return null;

  return (
    <table className="max-w-screen min-w-100">
      <thead>
        <tr>
          {["Brand", "1st Level", "2nd Level", "3rd Level", "4th Level", "5th Level", "6th Level", "Display Name", "Type", "Year", "MPN's", "Edit"].map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id || index}>
            <td>{row.brand}</td>
            <td>{row.top_level_category}</td>
            <td>{row.second_level_category}</td>
            <td>{row.third_level_category}</td>
            <td>{row.fourth_level_category}</td>
            <td>{row.fifth_level_category}</td>
            <td>{row.sixth_level_category}</td>
            <td>{row.product_display_name}</td>
            <td>{row.document_type}</td>
            <td>{row.year}</td>
            <td className="truncate whitespace-nowrap overflow-hidden max-w-[15ch]">{row.mpn}</td>
            <td>
              <MediumButton text="Edit" action={() => onEdit(row)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}