import type React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepeatableFieldListProps<T> {
  title: string;
  items: T[];
  emptyText?: string;
  defaultItem: T;
  onItemsChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
}

export function RepeatableFieldList<T>({
  title,
  items = [],
  emptyText = "No items added yet.",
  defaultItem,
  onItemsChange,
  renderItem,
}: RepeatableFieldListProps<T>) {
  function addItem() {
    onItemsChange([...items, { ...defaultItem }]);
  }

  function removeItem(index: number) {
    onItemsChange(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, patch: Partial<T>) {
    const updated = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onItemsChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title} ({items.length})</h4>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8 text-xs gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add {title.replace(/s$/, "") || "Item"}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-card/30 p-6 text-center text-xs text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="relative rounded-xl border border-border/80 bg-card/40 p-4 pt-5 space-y-3">
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {renderItem(item, idx, (patch) => updateItem(idx, patch))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
