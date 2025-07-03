
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useServices } from '@/hooks/useServices';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import { cn } from '@/lib/utils';
import type { ServiceCategory } from '@/types/services';

interface CreateServiceRequestModalProps {
  onServiceRequestCreated?: () => void;
}

export const CreateServiceRequestModal: React.FC<CreateServiceRequestModalProps> = ({
  onServiceRequestCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: '',
    budget_min: '',
    budget_max: '',
    deadline: undefined as Date | undefined,
  });

  const { useServiceCategories, createServiceRequest } = useServices();
  const { data: categories, isLoading } = useServiceCategories();

  const selectedCategory = categories?.find(cat => cat.name === formData.service_type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.service_type) {
      return;
    }

    try {
      const budget_range = formData.budget_min && formData.budget_max ? {
        min: parseFloat(formData.budget_min),
        max: parseFloat(formData.budget_max),
      } : undefined;

      await createServiceRequest.mutateAsync({
        title: formData.title,
        description: formData.description,
        service_type: formData.service_type,
        budget_range,
        deadline: formData.deadline?.toISOString().split('T')[0],
      });

      setFormData({
        title: '',
        description: '',
        service_type: '',
        budget_min: '',
        budget_max: '',
        deadline: undefined,
      });
      
      setOpen(false);
      onServiceRequestCreated?.();
    } catch (error) {
      console.error('Error creating service request:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Request Service
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Professional Service</DialogTitle>
        </DialogHeader>

        <LoadingWrapper loading={isLoading}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What service do you need?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="service_type">Service Category</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your service requirements in detail..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Category-specific guidance */}
            {selectedCategory && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{selectedCategory.name} - Typical Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedCategory.default_deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="outline">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                  {selectedCategory.description && (
                    <p className="text-sm text-muted-foreground">
                      {selectedCategory.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Budget Range */}
            <div className="space-y-4">
              <Label>Budget Range (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_min" className="text-sm">Minimum ($)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    min="0"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                    placeholder="Min budget"
                  />
                </div>
                <div>
                  <Label htmlFor="budget_max" className="text-sm">Maximum ($)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    min="0"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                    placeholder="Max budget"
                  />
                </div>
              </div>
              
              {selectedCategory?.expected_budget_range && (
                <p className="text-sm text-muted-foreground">
                  Typical range for {selectedCategory.name}: ${selectedCategory.expected_budget_range.min} - ${selectedCategory.expected_budget_range.max}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <Label>Deadline (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "PPP") : "Select deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => setFormData({ ...formData, deadline: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createServiceRequest.isPending}
              >
                {createServiceRequest.isPending ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </form>
        </LoadingWrapper>
      </DialogContent>
    </Dialog>
  );
};
