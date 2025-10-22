import type * as React from "react";
import { IMaskMixin } from "react-imask";
import { Input } from "@/components/ui/input";

const MaskedInput = IMaskMixin(
  ({ inputRef, ...props }: { inputRef: React.Ref<HTMLInputElement> }) => {
    return <Input {...props} ref={inputRef} />;
  },
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
