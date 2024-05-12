import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type TemplateFieldForm } from '@/providers/template-field-provider'
import { RiDeleteBinLine } from '@remixicon/react'
import { nanoid } from 'nanoid'
import { useFieldArray, useFormContext } from 'react-hook-form'

interface CustomSelectFieldRendererProps {
  index: number
}

export function CustomSelectFieldRenderer({
  index,
}: CustomSelectFieldRendererProps) {
  const { control } = useFormContext<TemplateFieldForm>()
  const { append, fields, remove } = useFieldArray({
    control,
    name: `fields.${index}.meta.options`,
    keyName: '_id',
  })

  const handleAppend = () => {
    append({ id: nanoid(7), value: '' })
  }

  const isDeleteDisabled = fields.length === 1

  return (
    <div className="flex flex-col gap-y-2 pt-2">
      <fieldset>
        <legend className="text-sm font-medium leading-none">Options</legend>

        {fields.map((item, fieldIndex) => (
          <div key={item._id} className="flex items-center gap-x-2">
            <FormField
              control={control}
              name={`fields.${index}.meta.options.${fieldIndex}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">
                    option {fieldIndex + 1}
                  </FormLabel>
                  <FormControl>
                    <Input className="h-8 min-w-16" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              disabled={isDeleteDisabled}
              onClick={() => {
                remove(fieldIndex)
              }}
              variant="ghost"
              size="sm"
              className="group h-8 w-8 p-2"
            >
              <RiDeleteBinLine
                aria-hidden
                className="h-8 w-8 text-red-500/70 group-hover:text-red-500"
              />
            </Button>
          </div>
        ))}
      </fieldset>

      <div>
        <Button onClick={handleAppend} size="sm" className="w-full">
          Add Option
        </Button>
      </div>
    </div>
  )
}
