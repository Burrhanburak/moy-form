import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { Badge } from "./ui/badge";
import { Gift, MousePointerClick, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function OfferCard() {
  return (
    <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-950  space-y-4">
      <FieldGroup>
        <FieldSet>
          <FieldLabel htmlFor="compute-environment-p8w">
            <div className="flex flex-col justify-between gap-2">
              <Badge className="bg-[#FF4D00] text-white text-sm text-center">
                <Sparkles className="mr-1 h-3 w-3 " />
                Limited Offer (10% Discount)
              </Badge>
              <h3 className="font-semibold text-lg text-black dark:text-white">
                Take Your Business to the Next Level
              </h3>
            </div>{" "}
          </FieldLabel>
          <FieldDescription className="text-sm text-muted-foreground">
            You’ve just unlocked exclusive post-purchase offers — boost your
            growth with our agency tools and management systems. Limited access
            for new clients only.
          </FieldDescription>
          <RadioGroup defaultValue="kubernetes">
            <FieldLabel htmlFor="kubernetes-r2h">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Panel Management System</FieldTitle>
                  <FieldDescription className="flex items-start gap-3 text-sm mt-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF4D00]/10 dark:bg-[#FF4D00]/10">
                        <Gift className="h-4 w-4 text-black dark:text-white" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium leading-relaxed">
                          Control your business with a powerful panel.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Employee tracking • Client management • Sales
                          dashboard • Appointment system • CRM integration
                        </p>
                      </div>
                    </div>
                  </FieldDescription>
                </FieldContent>
                <Link href="https://panelmanage.com" target="_blank">
                  <MousePointerClick className="h-4 w-4" />
                </Link>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="vm-z4k">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Social Media Growth with Agency Moydus
                  </FieldTitle>
                  <FieldDescription className="flex items-start gap-3 text-sm mt-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF4D00]/10 dark:bg-[#FF4D00]/10">
                        <Sparkles className="h-4 w-4 text-black dark:text-white" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium leading-relaxed">
                          Get professional social media management and grow
                          fast.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Includes $100 welcome bonus • Free brand strategy call
                        </p>
                      </div>
                    </div>
                  </FieldDescription>
                </FieldContent>
                <Link href="https://moydus.com" target="_blank">
                  <MousePointerClick className="h-4 w-4 text-black dark:text-white" />
                </Link>
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
