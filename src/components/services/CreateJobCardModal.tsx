
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import type { CreateJobCardData } from '@/types/services';

interface CreateJobCardModalProps {
  workOrderId: string;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export const CreateJobCardModal: React.FC<CreateJobCardModalProps> = ({
  workOrderId,
  trigger,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const { createJobCard } = useServices();

  const form = useForm<CreateJobCardData>({
    defaultValues: {
      work_order_id: workOrderId,
    },
  });

  const onSubmit = async (data: CreateJobCardData) => {
    try {
      await createJobCard.mutateAsync(data);
      setOpen(false);
      form.reset({ work_order_id: workOrderId });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating job card:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Job Card
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              {...form.register('title', { required: 'Title is required' })}
              placeholder="Brief title for this task"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              {...form.register('description')}
              placeholder="Detailed description of what needs to be done"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              type="date"
              {...form.register('due_date')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createJobCard.isPending}
            >
              {createJobCard.isPending ? 'Creating...' : 'Create Job Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
