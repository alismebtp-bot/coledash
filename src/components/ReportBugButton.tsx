import { useState } from 'react'
import { Bug, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function ReportBugButton() {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    toast.success('Bug report submitted. Thank you!')
    setDescription('')
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 gap-2"
        onClick={() => setOpen(true)}
      >
        <Bug className="h-4 w-4" />
        Report Bug
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Bug</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the bug you encountered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSubmit} disabled={!description.trim()} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
