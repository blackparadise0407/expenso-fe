import { useMutation } from '@tanstack/react-query'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { transactionsApi } from '@/apis/transactions'
import { useToast } from '@/contexts/ToastContext'
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery'

import { DatePicker } from '../DatePicker'
import { Select } from '../Select'
import { Switch } from '../Switch'
import { TextField } from '../TextField'

type Payload = Pick<
  Transaction,
  'amount' | 'name' | 'income' | 'category' | 'transactionDate'
>

export default function CreateTransactionCard() {
  const categoriesQuery = useCategoriesQuery(true)
  const { enqueue } = useToast()
  const transactionCreateMutation = useMutation<Transaction, string, Payload>(
    (payload) => transactionsApi.create(payload)
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Payload>()

  const onSubmit: SubmitHandler<Payload> = async (data) => {
    try {
      const amount = parseInt(data.amount.toString().split(',').join(''))
      await transactionCreateMutation.mutateAsync({ ...data, amount })
      enqueue('Create transaction success')
      reset()
    } catch (e) {
      enqueue(e as string, { variant: 'error' })
    }
  }

  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  }))

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 grid grid-cols-2 gap-x-5 gap-y-3 rounded-lg shadow bg-white"
    >
      <div className="col-span-2">
        <h4 className="font-bold text-gray-900">Add new transaction</h4>
      </div>
      <div className="form-group col-span-1">
        <label htmlFor="name">Name</label>
        <TextField
          fullWidth
          inputProps={{
            autoComplete: 'off',
            placeholder: 'Enter name',
            ...register('name', { required: 'Transaction name is required' }),
          }}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>
      <div className="form-group col-span-1">
        <label htmlFor="name">Category</label>
        <Controller
          name="category"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <Select
              placeholder="Select a category"
              options={categoryOptions}
              {...field}
            />
          )}
        />
        {errors.category && (
          <p className="form-error">{errors.category.message}</p>
        )}
      </div>
      <div className="form-group col-span-1">
        <label htmlFor="amount">Amount</label>
        <TextField
          fullWidth
          inputProps={{
            ...register('amount', {
              required: 'Amount is required',
              min: {
                value: 1000,
                message: 'Amount must be greater than 1,000',
              },
            }),
            onKeyDown: (e) => {
              if (!/^[0-9]*$/.test(e.key) && e.key !== 'Backspace') {
                e.preventDefault()
              }
            },
            placeholder: 'Enter amount',
            onBlur: (e) => {
              const val = e.target.value.split(',').join('')
              if (!val) {
                return
              }
              e.target.value = Intl.NumberFormat('us').format(
                parseInt(val) || 0
              )
            },
          }}
        />
        {errors.amount && <p className="form-error">{errors.amount.message}</p>}
      </div>
      <div className="form-group col-span-1">
        <label htmlFor="transactionDate">Transaction date</label>
        <Controller
          name="transactionDate"
          control={control}
          rules={{ required: 'Transaction date is required' }}
          defaultValue={undefined}
          render={({ field }) => <DatePicker fullWidth {...field} />}
        />
        {errors.transactionDate && (
          <p className="form-error">{errors.transactionDate.message}</p>
        )}
      </div>
      <div className="col-span-1 form-group">
        <label htmlFor="income">Income</label>
        <Switch {...register('income')} />
      </div>
      <button type="submit" className="mt-5 col-span-2 btn btn--primary">
        Add transaction
      </button>
    </form>
  )
}
