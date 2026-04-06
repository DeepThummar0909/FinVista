'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'

export function AddInvestmentModal({ type, onAdded, buttonText }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [extra, setExtra] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/investment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        name,
        amount: parseFloat(amount),
        ...extra,
      }),
    })
    setLoading(false)
    if (res.ok) {
      setOpen(false)
      setName('')
      setAmount('')
      setExtra({})
      onAdded && onAdded()
    } else {
      alert('Failed to add investment')
    }
  }

  const commonFieldClass = 'space-y-2'

  let fields = null
  if (type === 'FD') {
    fields = (
      <>
        <div className={commonFieldClass}>
          <Label>FD Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={commonFieldClass}>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className={commonFieldClass}>
            <Label>Start Date</Label>
            <Input
              type="date"
              onChange={(e) => setExtra({ ...extra, startDate: e.target.value })}
              required
            />
          </div>
          <div className={commonFieldClass}>
            <Label>Maturity Date</Label>
            <Input
              type="date"
              onChange={(e) => setExtra({ ...extra, endDate: e.target.value })}
              required
            />
          </div>
        </div>
        <div className={commonFieldClass}>
          <Label>Interest Rate (%)</Label>
          <Input
            type="number"
            onChange={(e) => setExtra({ ...extra, interestRate: e.target.value })}
            required
          />
        </div>
      </>
    )
  } else if (type === 'STOCKS') {
    fields = (
      <>
        <div className={commonFieldClass}>
          <Label>Stock Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={commonFieldClass}>
          <Label>Buying Price</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className={commonFieldClass}>
          <Label>Buying Date</Label>
          <Input
            type="date"
            onChange={(e) => setExtra({ ...extra, purchaseDate: e.target.value })}
            required
          />
        </div>
        <div className={commonFieldClass}>
          <Label>Quantity</Label>
          <Input
            type="number"
            onChange={(e) => setExtra({ ...extra, quantity: e.target.value })}
            required
          />
        </div>
      </>
    )
  } else if (type === 'SIP') {
    fields = (
      <>
        <div className={commonFieldClass}>
          <Label>SIP Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={commonFieldClass}>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className={commonFieldClass}>
          <Label>Start Date</Label>
          <Input
            type="date"
            onChange={(e) => setExtra({ ...extra, startDate: e.target.value })}
            required
          />
        </div>
        <div className={commonFieldClass}>
          <Label>Status</Label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary"
            value={extra.status || 'active'}
            onChange={(e) => setExtra({ ...extra, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </>
    )
  } else if (type === 'MUTUAL_FUNDS') {
    fields = (
      <>
        <div className={commonFieldClass}>
          <Label>Fund Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={commonFieldClass}>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className={commonFieldClass}>
          <Label>Investment Date</Label>
          <Input
            type="date"
            onChange={(e) => setExtra({ ...extra, investmentDate: e.target.value })}
            required
          />
        </div>
      </>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-full flex flex-col items-center justify-center border-dashed hover:border-gray-500 transition"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-10 w-10 mb-1 text-muted-foreground" />
        <span className="text-sm font-medium">{buttonText}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === 'FD' && 'Add New Fixed Deposit'}
              {type === 'STOCKS' && 'Add New Stock'}
              {type === 'SIP' && 'Add New SIP'}
              {type === 'MUTUAL_FUNDS' && 'Add New Mutual Fund'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new investment to your portfolio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {fields}
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Adding...' : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
