/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SignaturePad } from '@/components/ui/signature-pad'

import { type TemplateSigningFieldForm } from '@/providers/template-signing-field-provider'
import { type RouterOutputs } from '@/trpc/shared'
import { useFormContext } from 'react-hook-form'

type Field = RouterOutputs['template']['getSigningFields']['fields'][number]

type FieldRendererProps = Pick<
  Field,
  'type' | 'name' | 'required' | 'readOnly' | 'id' | 'prefilledValue' | 'meta'
>

export function FieldRenderer({
  type,
  name,
  required,
  readOnly,
  prefilledValue,
  id,
  meta,
}: FieldRendererProps) {
  const { control } = useFormContext<TemplateSigningFieldForm>()

  const disabled = readOnly

  const fieldName = `fieldValues.${id}` as const

  const rules = {
    ...(required && !disabled
      ? {
          required: {
            message: 'this field is required',
            value: required,
          },
        }
      : undefined),
  }

  const commonProps = {
    control,
    rules,
    name: fieldName,
  }

  switch (type) {
    case 'TEXT':
      return (
        <FormField
          {...commonProps}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <FormControl>
                <Input disabled={disabled} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    case 'SIGNATURE':
      return (
        <FormField
          {...commonProps}
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <FormControl>
                <SignaturePad
                  disabled={disabled}
                  onChange={(val) => {
                    onChange(val)
                  }}
                  prefilledValue={prefilledValue}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case 'DATE':
      return (
        <FormField
          {...commonProps}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <FormControl>
                <Input disabled={disabled} type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case 'SELECT':
      return (
        <FormField
          {...commonProps}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {meta &&
                    meta?.options &&
                    meta.options.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.value}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    default:
      return null
  }
}
