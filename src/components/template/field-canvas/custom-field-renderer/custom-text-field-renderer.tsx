import { Input } from '@/components/ui/input'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { type TemplateFieldForm } from '@/providers/template-field-provider'
import { useFormContext } from 'react-hook-form'

interface CustomTextFieldRendererProps {
  index: number
}

export function CustomTextFieldRenderer({
  index,
}: CustomTextFieldRendererProps) {
  const { control } = useFormContext<TemplateFieldForm>()

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="text-sm">
          Additional settings
        </AccordionTrigger>

        <AccordionContent>
          <div className="flex flex-col gap-y-2">
            <FormField
              control={control}
              name={`fields.${index}.defaultValue`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default value</FormLabel>
                  <FormControl>
                    <Input className="h-8 min-w-16" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`fields.${index}.readOnly`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>Read only field</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
