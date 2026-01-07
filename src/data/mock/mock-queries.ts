// Mock query responses for demo mode
// This simulates Supabase query responses

export const mockQueries = {
  patients: {
    list: () => ({
      data: [],
      error: null,
    }),
  },
  appointments: {
    list: () => ({
      data: [],
      error: null,
    }),
  },
}

