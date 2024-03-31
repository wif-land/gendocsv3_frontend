interface IProps {
  children: React.ReactNode
}

const styles = 'w-full max-w-[260px] px-1 py-2'

export const ListboxWrapper = ({ children }: IProps) => (
  <>
    <div className={styles}>{children}</div>
  </>
)
