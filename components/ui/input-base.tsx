"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Primitive } from "@radix-ui/react-primitive";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type InputBaseContextProps = Pick<
  InputBaseProps,
  "autoFocus" | "disabled"
> & {
  controlRef: React.RefObject<HTMLElement | null>;
  onFocusedChange: (focused: boolean) => void;
};

const InputBaseContext = React.createContext<InputBaseContextProps>({
  autoFocus: false,
  controlRef: { current: null },
  disabled: false,
  onFocusedChange: () => {},
});

function useInputBase() {
  const context = React.useContext(InputBaseContext);
  if (!context) {
    throw new Error("useInputBase must be used within a <InputBase />.");
  }

  return context;
}

export interface InputBaseProps
  extends React.ComponentProps<typeof Primitive.div> {
  autoFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
}

function InputBase({
  autoFocus,
  disabled,
  className,
  onClick,
  error,
  ...props
}: InputBaseProps) {
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef<HTMLElement>(null);

  return (
    <InputBaseContext.Provider
      value={{
        autoFocus,
        controlRef,
        disabled,
        onFocusedChange: setFocused,
      }}
    >
      <Primitive.div
        data-slot="input-base"
        // Based on MUI's <InputBase /> implementation.
        // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/InputBase/InputBase.js#L458~L460
        onClick={composeEventHandlers(onClick, (event) => {
          if (controlRef.current && event.currentTarget === event.target) {
            controlRef.current.focus();
          }
        })}
        className={cn(
          "w-full h-[50px] flex items-center relative rounded-[10px]",
          "bg-[#1c1c1c] border border-[#313131] transition-all duration-200",
          "focus-within:bg-white/5 focus-within:border-white/10",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          error &&
            "ring-destructive/20 dark:ring-destructive/40 border-destructive",
          className,
        )}
        {...props}
      />
    </InputBaseContext.Provider>
  );
}

function InputBaseFlexWrapper({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.div>) {
  return (
    <Primitive.div
      data-slot="input-base-flex-wrapper"
      className={cn("flex flex-1 flex-wrap", className)}
      {...props}
    />
  );
}

function InputBaseControl({
  ref,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof Slot>) {
  const { controlRef, autoFocus, disabled, onFocusedChange } = useInputBase();

  const composedRefs = useComposedRefs(controlRef, ref);

  return (
    <Slot
      data-slot="input-base-control"
      ref={composedRefs}
      autoFocus={autoFocus}
      onFocus={composeEventHandlers(onFocus, () => onFocusedChange(true))}
      onBlur={composeEventHandlers(onBlur, () => onFocusedChange(false))}
      {...{ disabled }}
      {...props}
    />
  );
}

export interface InputBaseAdornmentProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

function InputBaseAdornment({
  className,
  asChild,
  children,
  ...props
}: InputBaseAdornmentProps) {
  const Comp = asChild ? Slot : typeof children === "string" ? "p" : "div";

  return (
    <Comp
      data-slot="input-base-adornment"
      className={cn(
        "text-white flex items-center justify-center [&_svg:not([class*='size-'])]:size-4 text-white",
        "[&:not(:has(button))]:pointer-events-none",
        "absolute right-3 top-1/2 transform -translate-y-1/2",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

function InputBaseAdornmentButton({
  type = "button",
  variant = "ghost",
  size = "icon",
  disabled: disabledProp,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { disabled } = useInputBase();

  return (
    <Button
      data-slot="input-base-adornment-button"
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || disabledProp}
      className={cn("size-6 bg-none ", className)}
      {...props}
    />
  );
}

function InputBaseInput({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.input>) {
  return (
    <Primitive.input
      data-slot="input-base-input"
      className={cn(
        "w-full h-[50px] flex items-center relative rounded-[10px]",
        "bg-[#1c1c1c] border border-[#313131] transition-all duration-200",
        "focus:outline-none",
        "placeholder:text-[#999999] md:text-sm px-4 py-2",
        className,
      )}
      {...props}
    />
  );
}

function InputBaseTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-base-textarea"
      className={cn(
        "w-full h-[50px] flex items-center relative rounded-[10px]",
        "bg-[#1c1c1c] border border-[#313131] transition-all duration-200",
        "focus-within:bg-white/5 focus-within:border-white/10",
        "placeholder:text-[#999999] md:text-sm px-4 py-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputBase,
  InputBaseFlexWrapper,
  InputBaseControl,
  InputBaseAdornment,
  InputBaseAdornmentButton,
  InputBaseInput,
  InputBaseTextarea,
  useInputBase,
};
