import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { TableProps } from '../../../../shared/sdk/table'

interface Props {
  tableData: FunctionaryModel[]
  setTableData: (data: FunctionaryModel[]) => void
  table: TableProps
  setCount: (count: number) => void
  isDataFiltered: boolean
  visitedPages: number[]
}

export const useFunctionaryTable = ({
  table,
  visitedPages,
  isDataFiltered,
}: Props) => ({
  handleChangePage,
})
