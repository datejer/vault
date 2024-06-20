import { useCallback, useEffect, useMemo, useState } from "react";
import { Spreadsheet as SpreadsheetPrimitive } from "react-spreadsheet";
import debounce from "lodash.debounce";
import { Minus, Plus } from "lucide-react";
import { SpreadsheetData } from "@/components/NewVaultDialog";
import { Button } from "@/components/ui/button";

const ALLOWED_DISABLED_SPREADSHEET_COMBOS = [
  { metaKey: true, key: "c" },
  { metaKey: true, key: "a" },
];

type SpreadsheetProps = {
  isDecrypted: boolean;
  data: SpreadsheetData;
  onChange: (data: SpreadsheetData) => void;
  disabled?: boolean;
} & React.ComponentProps<typeof SpreadsheetPrimitive>;

export const Spreadsheet = ({
  isDecrypted,
  data,
  onChange,
  disabled,
  onKeyDown,
  ...rest
}: SpreadsheetProps) => {
  const [internalData, setInternalData] = useState(data);

  console.log(data[0][0]?.value || "no value");

  useEffect(() => {
    setInternalData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDecrypted]);

  const addColumn = useCallback(() => {
    if (!disabled) {
      setInternalData((data) =>
        data.map((row) => {
          const nextRow = [...row];
          nextRow.length += 1;
          return nextRow;
        }),
      );
    }
  }, [disabled]);

  const removeColumn = useCallback(() => {
    if (!disabled) {
      setInternalData((data) =>
        data.map((row) => {
          return row.slice(0, row.length - 1);
        }),
      );
    }
  }, [disabled]);

  const addRow = useCallback(() => {
    if (!disabled) {
      setInternalData((data) => {
        const columns = data.reduce((maxColumns, row) => Math.max(maxColumns, row.length), 0);
        return [...data, Array(columns)];
      });
    }
  }, [disabled]);

  const removeRow = useCallback(() => {
    if (!disabled) {
      setInternalData((data) => {
        return data.slice(0, data.length - 1);
      });
    }
  }, [disabled]);

  const internalOnChange = useMemo(() => debounce(setInternalData, 100), []);

  // on change of internal data, call the onChange prop
  // with the new data
  useEffect(() => {
    if (!disabled) {
      onChange(internalData);
    }
  }, [disabled, internalData, onChange]);

  return (
    // spread      butooo
    //       sheet ooooon
    // buttoooooon
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gridTemplateRows: "auto auto",
      }}
    >
      <SpreadsheetPrimitive
        {...rest}
        data={internalData}
        onChange={internalOnChange}
        onKeyDown={(e) => {
          if (disabled) {
            if (
              !ALLOWED_DISABLED_SPREADSHEET_COMBOS.some(
                (combo) => e.metaKey === combo.metaKey && e.key === combo.key,
              )
            ) {
              e.preventDefault();
            }
          }

          if (onKeyDown) {
            onKeyDown(e);
          }
        }}
      />
      {!disabled && (
        <div className="flex flex-row ml-1 gap-1">
          <Button variant="secondary" className="p-0 h-full w-8" onClick={removeColumn}>
            <Minus className="h-6 w-6" />
          </Button>
          <Button variant="secondary" className="p-0 h-full w-8" onClick={addColumn}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
      {!disabled && (
        <div className="flex flex-col mt-1 gap-1">
          <Button variant="secondary" className="p-0 h-8 w-full" onClick={removeRow}>
            <Minus className="h-6 w-6" />
          </Button>
          <Button variant="secondary" className="p-0 h-8 w-full" onClick={addRow}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
