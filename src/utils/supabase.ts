import { createClient } from '@supabase/supabase-js'

import { env } from '@/constants'

// Create a single supabase client for interacting with your database
export const supabase = createClient(env.supabase.url, env.supabase.apiKey)
