import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

export const GeneralDetailsFields = [
  'safeId',
  'valuationCap',
  'discountRate',
  'proRata',
]

export const GeneralDetails = () => {
  const form = useFormContext()

  return (
    <div className="grid-cols-2 space-y-4">
      <FormField
        control={form.control}
        name="safeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Safe ID</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="valuationCap"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valuation cap</FormLabel>
            <FormControl>
              <Input
                type={'text'}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="discountRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount rate</FormLabel>
            <FormControl>
              {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
              <Input
                type="text"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage className="text-xs font-light" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="proRata"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              {/* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */}
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="space-y-1 leading-none">
              Pro-rata rights
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  )
}
