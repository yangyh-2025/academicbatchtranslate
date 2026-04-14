import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TranslatePayload, WorkflowType } from '@/types/api'

interface ConfigState {
  workflow: WorkflowType
  payload: Partial<TranslatePayload>
  updateWorkflow: (workflow: WorkflowType) => void
  updatePayload: (payload: Partial<TranslatePayload>) => void
  resetConfig: () => void
}

const initialPayload: Partial<TranslatePayload> = {
  skip_translate: false,
  base_url: '',
  api_key: 'xx',
  model_id: '',
  to_lang: '中文',
  chunk_size: 1000,
  concurrent: 5,
  temperature: 0.3,
  top_p: 0.9,
  timeout: 60,
  thinking: 'default',
  retry: 3,
  system_proxy_enable: false,
  glossary_generate_enable: false,
  force_json: false,
  output_filename_suffix: '_translated',
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      workflow: 'auto',
      payload: initialPayload,
      updateWorkflow: (workflow: WorkflowType) => set({ workflow }),
      updatePayload: (payload: Partial<TranslatePayload>) => set((state) => ({
        payload: { ...state.payload, ...payload }
      })),
      resetConfig: () => set({
        workflow: 'auto',
        payload: initialPayload,
      }),
    }),
    {
      name: 'docutranslate-config',
      version: 1,
    }
  )
)
