import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { categoriesApi } from '@/apis/categories'
import { FileUploadInput } from '@/components/FileUploadInput'
import { Modal } from '@/components/Modal'
import { ModalProps } from '@/components/Modal/Modal'
import { TextArea } from '@/components/TextArea'
import { TextField } from '@/components/TextField'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/utils/supabase'
import { getSupabasePublicUrl } from '@/utils/utils'

interface CategoryModalProps extends Pick<ModalProps, 'open' | 'onClose'> {
  category?: Category
}

interface Payload extends Pick<Category, 'name' | 'description'> {
  image: FileList
}

export default function CategoryModal({
  category,
  open,
  onClose,
}: CategoryModalProps) {
  const { enqueue } = useToast()
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm<Payload>()
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<Payload> = async (data) => {
    setLoading(true)
    const img = data.image[0]
    const fileName =
      img.name.substring(0, img.name.lastIndexOf('.')) +
      '-' +
      Date.now().toString()
    try {
      let imgUrl = ''
      if (img) {
        const resp = await supabase.storage
          .from('expenso.dev')
          .upload('public/' + fileName + '.jpg', data.image[0], {
            cacheControl: '3600',
            upsert: false,
          })
        if (resp.data?.Key) {
          imgUrl = getSupabasePublicUrl(resp.data.Key)
        }
      }
      if (!category) {
        categoriesApi.create({
          name: data.name,
          description: data.description,
          imgUrl,
        })
      } else {
        categoriesApi.update({
          id: category.id,
          name: data.name,
          description: data.description,
          imgUrl: imgUrl || category.imgUrl,
        })
      }
      enqueue('Create category success')
      onClose?.()
    } catch (e) {
      enqueue(typeof e === 'string' ? e : '')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof category !== 'undefined') {
      const keys: Array<keyof Pick<Category, 'name' | 'description'>> = [
        'name',
        'description',
      ]
      keys.forEach((key) => {
        setValue(key, category[key])
      })
    } else {
      reset()
    }
  }, [category])

  return (
    <Modal
      title="Create new category"
      open={open}
      onClose={onClose}
      cancelBtnProps={{ onClick: onClose }}
      okBtnProps={{
        type: 'submit',
        children: category ? 'Save' : 'Create',
        loading,
        onClick: handleSubmit(onSubmit),
      }}
    >
      <form className="grid grid-cols-2 gap-x-5 gap-y-3">
        <div className="form-group col-span-1">
          <label htmlFor="name">Name</label>
          <TextField
            fullWidth
            inputProps={{
              ...register('name', { required: 'Name cannot be empty' }),
            }}
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="form-group col-span-1">
          <label htmlFor="description">Image url</label>
          <FileUploadInput
            maxSize={1}
            className="w-full"
            accept="image/*"
            {...register('image')}
          />
          {errors.image && <p className="form-error">{errors.image.message}</p>}
        </div>
        <div className="form-group col-span-2">
          <label htmlFor="description">Description</label>
          <TextArea
            className="max-h-[100px]"
            maxLength={200}
            {...register('description', {
              required: 'Description cannot be empty',
              minLength: {
                value: 10,
                message: 'Minimum length is 10 characters',
              },
            })}
          />
          {errors.description && (
            <p className="form-error">{errors.description.message}</p>
          )}
        </div>
      </form>
    </Modal>
  )
}
