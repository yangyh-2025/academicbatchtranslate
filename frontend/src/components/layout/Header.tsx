import { FiHelpCircle } from 'react-icons/fi'

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">AcademicBatchTranslate</h1>
          <p className="text-xs text-neutral-500">学术论文批量翻译</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
          <FiHelpCircle className="w-5 h-5 text-neutral-600" />
        </button>
      </div>
    </header>
  )
}
