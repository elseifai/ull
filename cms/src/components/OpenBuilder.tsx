'use client'
import { useDocumentInfo } from '@payloadcms/ui'

// Sidebar link from a page's form to the visual page builder on the website.
const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4100').replace(/\/$/, '')

export function OpenBuilder() {
  const { id } = useDocumentInfo()
  const href = id ? `${site}/editor/?id=${id}` : `${site}/editor/`
  return (
    <div style={{ marginBottom: 'var(--base)' }}>
      <a
        href={href}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 14px',
          borderRadius: 6,
          background: '#0D3161',
          color: '#fff',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        {id ? 'Edit visually in page builder' : 'Open page builder'}
      </a>
      <p style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
        Drag blocks, edit text and photos on the real page. Use Live Preview (top of this form) to see form edits.
      </p>
    </div>
  )
}
