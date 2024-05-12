/* eslint-disable @next/next/no-img-element */
import { useFormContext, useWatch } from 'react-hook-form'
import {
  ReadOnlyTemplateFieldContainer,
  type ReadOnlyTemplateFieldContainerProps,
} from './template-field-container'

import { type TemplateSigningFieldForm } from '@/providers/template-signing-field-provider'

type ReadOnlyTemplateFieldProps = Omit<
  ReadOnlyTemplateFieldContainerProps,
  'children' | 'color'
> &
  Pick<
    TemplateSigningFieldForm['fields'][number],
    'name' | 'type' | 'recipientId' | 'prefilledValue' | 'id' | 'meta'
  >

export const ReadOnlyTemplateField = ({
  name,
  type,
  id,
  recipientId,
  prefilledValue,
  meta,
  ...rest
}: ReadOnlyTemplateFieldProps) => {
  const { getValues } = useFormContext<TemplateSigningFieldForm>()
  const value = useWatch<TemplateSigningFieldForm>({
    name: `fieldValues.${id}` as const,
    disabled: !!prefilledValue,
  }) as string

  const colors = getValues('recipientColors')

  const color = colors?.[recipientId] ?? ''

  const selectValue =
    type === 'SELECT' && meta?.options
      ? meta.options.find((item) => item.id === value)?.value || undefined
      : undefined

  return (
    <ReadOnlyTemplateFieldContainer {...rest} color={color}>
      {type === 'SIGNATURE' ? (
        prefilledValue || value !== '' ? (
          <img
            src={prefilledValue ?? value}
            alt="signature"
            className="h-full "
          />
        ) : (
          <p>{name}</p>
        )
      ) : (
        <p>{selectValue ?? value}</p>
      )}
    </ReadOnlyTemplateFieldContainer>
  )
}
