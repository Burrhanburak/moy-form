import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

export default function FilterDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-sm">
          <Filter className="size-4 stroke-2" /> Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filter Results</DrawerTitle>
            <DrawerDescription>Select the filters to apply.</DrawerDescription>
          </DrawerHeader>
          <form className="grid gap-4 p-4 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox id="in-stock" />
              <Label htmlFor="in-stock">All</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="on-sale" />
              <Label htmlFor="on-sale">Tools</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="new" />
              <Label htmlFor="new">Add-ons</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="new" />
              <Label htmlFor="new">Services</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="new" />
              <Label htmlFor="new">Templates</Label>
            </div>
          </form>
          <DrawerFooter>
            <Button size="sm" type="submit">
              Apply
            </Button>
            <DrawerClose asChild>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
