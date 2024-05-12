import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Card } from '@/components/ui/card'
const formatter = new Intl.NumberFormat('en-US')

const SummaryTable = () => {
  const shareClasses = [
    {
      id: 1,
      name: 'Common shares',
      shares: 7000000,
      diluted: 4500000,
      ownership: 53,
      raised: 10000000,
    },

    {
      id: 2,
      name: 'Preferred (Series A)',
      shares: 2000000,
      diluted: 1500000,
      ownership: 15,
      raised: 18000000,
    },

    {
      id: 3,
      name: 'Preferred (Convertible note)',
      shares: 1000000,
      diluted: 500000,
      ownership: 7,
      raised: 7000000,
    },

    {
      id: 4,
      name: 'Stock Plan',
      shares: 2000000,
      diluted: 1000000,
      ownership: 15,
      raised: 2000000,
    },
  ]

  return (
    <Card className="mt-4">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Share class</TableHead>
            <TableHead>Authorized shares</TableHead>
            <TableHead>Diluted shares</TableHead>
            <TableHead>Ownership</TableHead>
            <TableHead className="text-right">Amount raised</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shareClasses.map((klass) => (
            <TableRow key={klass.id} className="border-none">
              <TableCell className="font-medium">{klass.name}</TableCell>
              <TableCell>{formatter.format(klass.shares)}</TableCell>
              <TableCell>{formatter.format(klass.diluted)}</TableCell>
              <TableCell>{formatter.format(klass.ownership)} %</TableCell>
              <TableCell className="text-right">
                $ {formatter.format(klass.raised)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              $ {formatter.format(55000000)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  )
}

export default SummaryTable
