import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// react-markdown zet geen HTML uit de mail in de pagina; alleen Markdown wordt opgemaakt
export function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}
