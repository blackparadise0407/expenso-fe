import { createClient } from '@supabase/supabase-js'

import { env } from '@/constants'

export const supabase = createClient(env.supabase.url, env.supabase.apiKey)
