type Props = {
  children: React.ReactNode
  methods: any
  onSubmit?: VoidFunction
}

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return <form onSubmit={onSubmit}>{children}</form>
}
