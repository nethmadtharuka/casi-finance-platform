import { z } from 'zod'

// Mirrors ExpenseRequest's validation (Sprint 2 backend): amount > 0,
// categoryId required, expenseDate required. Client-side validation here is a
// UX nicety — the backend remains the actual source of truth for these rules.
export const expenseFormSchema = z.object({
  amount: z.coerce
    .number({ message: 'Enter an amount' })
    .positive('Amount must be greater than 0'),
  categoryId: z.coerce.number({ message: 'Pick a category' }).int().positive('Pick a category'),
  expenseDate: z.string().min(1, 'Pick a date'),
  note: z.string().max(255, 'Note must be 255 characters or fewer').optional(),
})

export type ExpenseFormInput = z.input<typeof expenseFormSchema>
export type ExpenseFormValues = z.output<typeof expenseFormSchema>
