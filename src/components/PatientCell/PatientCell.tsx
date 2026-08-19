interface PatientCellProps {
  name: string
  location: string
}

export function PatientCell({ name, location }: PatientCellProps) {
  return (
    <div className="flex flex-col">
      <span className="text-body text-text-primary">{name}</span>
      <span className="text-small text-[#757575]">{location}</span>
    </div>
  )
}
