import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { useAddExpense, useUpdateExpense, useDeleteExpense } from '@/hooks/useExpenseMutations'
import { expenseFormSchema, type ExpenseFormInput, type ExpenseFormValues } from '@/schemas/expenseSchema'
import { getTodayDateString } from '@/lib/date'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CategoryChips from '@/components/CategoryChips'
import type { Expense } from '@/types/expense'

// Part 15 Add Expense wireframe: large amount input, category chips, date
// picker (defaults to today), optional note, full-width Save button.
//
// Handles BOTH create (/expenses/new) and edit (/expenses/:id/edit) — there's
// no GET /api/expenses/{id} endpoint (Sprint 2 only built list/create/update/delete),
// so the expense being edited is passed via router state from wherever the user
// tapped it (ExpenseListItem). Visiting the edit URL directly without that state
// (e.g. a bookmarked link) shows a "not found" message rather than crashing —
// flagging this as a real gap: worth adding a GET-by-id endpoint if deep-linking
// to a specific expense ever becomes a real use case.
export default function AddExpensePage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const existingExpense = (location.state as { expense?: Expense } | null)?.expense

  const categories = useCategories()
  const addExpense = useAddExpense()
  const updateExpense = useUpdateExpense()
  const deleteExpense = useDeleteExpense()

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: existingExpense?.amount,
      categoryId: existingExpense?.categoryId,
      expenseDate: existingExpense?.expenseDate ?? getTodayDateString(),
      note: existingExpense?.note ?? '',
    },
  })

  if (isEditMode && !existingExpense) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-foreground">This expense couldn't be found.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try opening it from the Dashboard or History list instead of a direct link.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/history')}>
          Go to History
        </Button>
      </div>
    )
  }

  async function onSubmit(values: ExpenseFormValues) {
    setServerError(null)
    try {
      if (isEditMode && id) {
        await updateExpense.mutateAsync({ id, payload: values })
      } else {
        await addExpense.mutateAsync(values)
      }
      navigate('/dashboard')
    } catch {
      setServerError('Something went wrong saving this expense. Please try again.')
    }
  }

  async function handleDelete() {
    if (!id) return
    if (!window.confirm('Delete this expense? This can\'t be undone.')) return
    await deleteExpense.mutateAsync(id)
    navigate('/history')
  }

  const isSaving = addExpense.isPending || updateExpense.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
      <div>
        <Label htmlFor="amount" className="sr-only">
          Amount
        </Label>
        <input
          id="amount"
          type="number"
          step="0.01"
          inputMode="decimal"
          autoFocus
          placeholder="0.00"
          className="figure w-full border-none bg-transparent text-center text-5xl text-foreground outline-none placeholder:text-muted-foreground/40"
          {...register('amount')}
        />
        {errors.amount && (
          <p className="mt-1 text-center text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block">Category</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <CategoryChips
              categories={categories.data ?? []}
              selectedId={(field.value as number | undefined) ?? null}
              onSelect={field.onChange}
            />
          )}
        />
        {errors.categoryId && (
          <p className="mt-1 text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expenseDate">Date</Label>
        <Input id="expenseDate" type="date" {...register('expenseDate')} />
        {errors.expenseDate && (
          <p className="text-sm text-destructive">{errors.expenseDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Input id="note" type="text" placeholder="e.g. Lunch with team" {...register('note')} />
        {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isSaving}>
        {isSaving ? 'Saving…' : 'Save'}
      </Button>

      {isEditMode && (
        <Button
          type="button"
          variant="ghost"
          className="w-full text-destructive hover:text-destructive"
          onClick={handleDelete}
          disabled={deleteExpense.isPending}
        >
          <Trash2 size={16} className="mr-2" />
          {deleteExpense.isPending ? 'Deleting…' : 'Delete Expense'}
        </Button>
      )}
    </form>
  )
}
