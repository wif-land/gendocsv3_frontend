import React from 'react'
import { DocumentsTableProvider } from '../context/DocumentTableProvider'
import { DocumentListView } from '../view'

const DocumentsListViewPage = ({ moduleId }: { moduleId: string }) => (
  <DocumentsTableProvider moduleCode={moduleId}>
    <DocumentListView />
  </DocumentsTableProvider>
)

export default DocumentsListViewPage
