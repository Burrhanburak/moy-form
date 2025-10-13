// components/PricingCard.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  highlightLabel?: string;
  buttonVariant?: "default" | "outline";
  showAdditionalServices?: boolean;
  fullWidth?: boolean;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  highlight = false,
  buttonVariant = "outline",
  showAdditionalServices = false,
  fullWidth = false,
}: PricingCardProps) {
  return (
    <div
      className={`flex flex-col justify-between p-6 space-y-4 ${
        highlight 
          ? fullWidth 
            ? "bg-secondary rounded-xl w-full space-y-8" 
            : "bg-secondary rounded-xl w-full md:w-1/2 space-y-8"
          : "flex-1"
      }`}
    >
      <div className={highlight ? (fullWidth ? "grid gap-6 grid-cols-1 lg:grid-cols-2" : "grid gap-6 sm:grid-cols-2") : ""}>
        <div className="space-y-4">
          <div>
            <h2 className="font-medium">{title}</h2>
            <span className="my-3 block text-2xl font-semibold">{price}</span>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          <div className="w-full">
          <Button className="w-full " variant={buttonVariant}>
            get started
          </Button>
          </div> 
        </div>
      </div>

      {highlight && (
        <div>
          <div className="text-sm font-medium">Everything in Free, plus:</div>
        </div>
      )}

      {fullWidth ? (
        <div className={`${highlight ? "mt-4" : "border-t pt-4"} grid grid-cols-1 md:grid-cols-2 gap-3 text-sm`}>
          {features.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="size-3" />
              {item}
            </div>
          ))}
        </div>
      ) : (
        <ul className={`${highlight ? "mt-4" : "border-t pt-4"} list-outside space-y-3 text-sm`}>
          {features.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="size-3" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Horizontal grid below features */}
      {showAdditionalServices && (
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm font-medium mb-4">Additional Services:</div>
          <div className={`grid gap-3 ${fullWidth ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
            <div className="bg-muted/50 rounded-lg">
              <div className="text-xs font-medium">SEO Optimization</div>
              <div className="text-xs text-muted-foreground">$200/mo</div>
            </div>
            <div className="bg-muted/50 rounded-lg ">
              <div className="text-xs font-medium">24/7 Support</div>
              <div className="text-xs text-muted-foreground">$150/mo</div>
            </div>
            <div className="bg-muted/50 rounded-lg ">
              <div className="text-xs font-medium">Performance Boost</div>
              <div className="text-xs text-muted-foreground">$100/mo</div>
            </div>
          </div>
        </div>
      )}
    
    </div>
  );
}