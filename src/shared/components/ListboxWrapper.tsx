
interface IProps{
    children: React.ReactNode
}
export const ListboxWrapper = ({children}:IProps) => (
  <div className="w-full max-w-[260px]  px-1 py-2">
    {children}
  </div>
);