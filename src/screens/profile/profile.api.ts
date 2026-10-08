// import { API_URL } from "@/src/core/utils/config"
// import { store } from "@/src/store/store"

// export type GymAccess = {
//     id: string
//     member_id: string
//     gym_id: string
//     is_primary: boolean
//     is_active: boolean
//     granted_by: string | null
//     granted_at: string
//     revoked_at: string | null
// }

// export type MemberProfile = {
//     id: string
//     email: string
//     full_name: string
//     phone: string
//     photo_url: string | null
//     status: string
//     pause_start: string | null
//     resume_date: string | null
//     created_at: string
//     gym_access: GymAccess[]
// }


// type ContactSupportResponse = Record<string, unknown>

// export type ContactSupportDetails = {
//     title?: string
//     description?: string
//     email?: string
//     phone?: string
//     address?: string
//     workingHours?: string
// }

// const getFirstText = (data: ContactSupportResponse, keys: string[]) => {
//     for (const key of keys) {
//         const value = data[key]
//         if (typeof value === 'string' && value.trim()) {
//             return value.trim()
//         }
//     }
// }



// export type UpdateProfilePayload = Partial<Pick<MemberProfile, 'full_name' | 'phone' | 'photo_url'>>

// const getAuthHeaders = () => {
//     const token = store.getState().organization.token
//     return {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     }
// }

// export const fetchProfile = async (): Promise<MemberProfile> => {
//     const res = await fetch(`${API_URL}/api/v1/members/profile`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//     })
//     if (!res.ok) {
//         const body = await res.json().catch(() => null)
//         throw new Error(body?.message || 'Failed to load profile')
//     }
//     return res.json()
// }

// export const updateProfile = async (payload: UpdateProfilePayload): Promise<MemberProfile> => {
//     const res = await fetch(`${API_URL}/api/v1/members/profile`, {
//         method: 'PATCH',
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//     })
//     if (!res.ok) {
//         const body = await res.json().catch(() => null)
//         throw new Error(body?.message || 'Failed to update profile')
//     }
//     return res.json()
// }


// export const deleteAccount = async () => {
//     const res = await fetch(`${API_URL}/api/v1/members/profile`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(),
//         // body: JSON.stringify(payload),
//     })
//     if (!res.ok) {
//         const body = await res.json().catch(() => null)
//         throw new Error(body?.message || 'Failed to update profile')
//     }
//     return res.json()
// }















// export const fetchContactSupport = async (): Promise<ContactSupportDetails> => {
//     if (!API_URL) {
//         throw new Error('API URL is not configured')
//     }

//     const response = await fetch(`${API_URL}/api/v1/help/contact-support`, {
//         method: 'GET',
//         headers: {
//             Accept: 'application/json',
//         },
//     })

//     if (!response.ok) {
//         throw new Error(`Could not load contact support details (${response.status})`)
//     }

//     const payload = (await response.json()) as ContactSupportResponse
//     const data = (payload.data && typeof payload.data === 'object'
//         ? payload.data
//         : payload) as ContactSupportResponse

//     return {
//         title: getFirstText(data, ['title', 'heading']),
//         description: getFirstText(data, ['description', 'message', 'content']),
//         email: getFirstText(data, ['email', 'support_email', 'supportEmail']),
//         phone: getFirstText(data, ['phone', 'support_phone', 'supportPhone']),
//         address: getFirstText(data, ['address', 'support_address', 'supportAddress', 'location']),
//         workingHours: getFirstText(data, [
//             'hours',
//             'support_hours',
//             'supportHours',
//             'working_hours',
//             'workingHours',
//             'business_hours',
//             'businessHours',
//         ]),
//     }
// }


