import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CostumInput } from "./custom-input";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, defaultCountry, ...props }, ref) => {
      const [detectedCountry, setDetectedCountry] = React.useState<
        RPNInput.Country | undefined
      >(defaultCountry);

      React.useEffect(() => {
        // Auto-detect country based on user's locale/timezone
        const detectCountry = () => {
          try {
            // Try to get country from timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Map common timezones to countries
            const timezoneToCountry: Record<string, RPNInput.Country> = {
              "Europe/Istanbul": "TR",
              "America/New_York": "US",
              "America/Los_Angeles": "US",
              "Europe/London": "GB",
              "Europe/Berlin": "DE",
              "Europe/Paris": "FR",
              "Asia/Tokyo": "JP",
              "Australia/Sydney": "AU",
              // Add more timezone mappings as needed
            };

            const countryFromTimezone = timezoneToCountry[timezone];
            if (countryFromTimezone) {
              setDetectedCountry(countryFromTimezone);
              return;
            }

            // Fallback: try to get country from locale
            const locale = navigator.language || "en-US";
            const countryCode = locale.split("-")[1]?.toUpperCase();

            // Validate if it's a valid country code
            const validCountries = [
              "TR",
              "US",
              "GB",
              "DE",
              "FR",
              "JP",
              "AU",
              "CA",
              "IT",
              "ES",
              "NL",
              "SE",
              "NO",
              "DK",
              "FI",
            ];
            if (countryCode && validCountries.includes(countryCode)) {
              setDetectedCountry(countryCode as RPNInput.Country);
            }
          } catch (error) {
            console.log("Could not detect country, using default");
          }
        };

        if (!value && !defaultCountry) {
          detectCountry();
        }
      }, [value, defaultCountry]);

      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          value={value || undefined}
          defaultCountry={detectedCountry || defaultCountry}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <CostumInput
    className={cn(
      "w-full h-[50px] min-w-0",
      "dark:bg-zinc-950 text-white placeholder:text-[#999999]",
      " border border-[#d1d1d1] dark:border-[#313131]  rounded-r-[10px] rounded-l-none",
      "px-4 py-3 outline-none box-border",
      "text-[16px] leading-[1.2em] font-normal tracking-[0em]",
      "focus:outline-none !focus:ring-0 !focus:border-[#313131]"
    )}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        open && setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-[50px] w-[120px] min-w-0",
            "flex items-center gap-2 justify-start",
            // 🎨 Arka planlar
            "bg-white dark:bg-zinc-950",
            // 🧱 Kenarlıklar
            "border border-[#d1d1d1] dark:border-[#313131] border-r-0 rounded-l-[10px]",
            // 📏 Pozisyon
            "relative z-10",
            // 🖋️ Yazı ve padding
            "px-4 text-[16px] leading-[1.2em] font-normal text-[#222] dark:text-[#999999]",
            // 🩶 Hover renkleri sabit ve sade
            "hover:bg-gray-50 dark:hover:bg-zinc-950",
            "hover:text-[#111] dark:hover:text-[#999999]",
            "hover:border-[#c1c1c1] dark:hover:border-[#313131]",
            // 🔍 Focus & active durumlarında renkler sabit
            "focus:bg-white active:bg-white dark:focus:bg-zinc-950 dark:active:bg-zinc-950",
            // 🚫 Tüm transition’lar kapalı
            "transition-none !important"
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "ml-auto h-4 w-4 opacity-50",
              "hover:opacity-50 focus:opacity-50 active:opacity-50", // hover efektini sabitle
              "transition-none",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-white dark:bg-zinc-950 border border-[#d1d1d1] dark:border-[#313131] text-black dark:text-white">
        <Command className="bg-white dark:bg-zinc-950 text-black dark:text-white">
          <CommandInput
            className="bg-white dark:bg-zinc-950 text-black dark:text-white placeholder:text-[#777] dark:placeholder:text-[#999] relative z-20"
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    "[data-radix-scroll-area-viewport]"
                  );
                  if (viewportElement) viewportElement.scrollTop = 0;
                }
              }, 0);
            }}
            placeholder="Search country..."
          />
          <CommandList className="bg-white dark:bg-zinc-950 text-black dark:text-white">
            <ScrollArea
              ref={scrollAreaRef}
              className="h-72 bg-white dark:bg-zinc-950 text-black dark:text-white"
            >
              <CommandEmpty className="text-[#777] dark:text-[#999]">
                No country found.
              </CommandEmpty>
              <CommandGroup className="bg-white dark:bg-zinc-950 text-black dark:text-white">
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem
      className="gap-2 text-white dark:text-black hover:bg-[#313131] focus:bg-[#313131] data-[selected=true]:bg-[#eeeeee] dark:data-[selected=true]:bg-[#313131]"
      onSelect={handleSelect}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm text-black dark:text-white">
        {countryName}
      </span>
      <span className="text-sm text-[#999999]">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ml-auto size-4 text-white dark:text-black ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm  [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
