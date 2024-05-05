"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import classNames from "classnames"
import React, { useLayoutEffect, useRef, useState } from "react"

type Props = {
  className?: string
  inputClassName?: string
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  editable?: boolean
  onChange?: (value: string | number) => void
}

const InputNumber = React.forwardRef<HTMLInputElement, Props>(
  ({ value, className, inputClassName, defaultValue, min, max, editable, onChange }: Props, ref) => {
    const preValue = useRef<number>(defaultValue || 0)
    const [currentValue, setCurrentValue] = useState<string>("")

    const handleDecreseValue = () => {
      const newValue = preValue.current - 1
      if (min && newValue < min) {
        return
      }
      preValue.current = newValue
      setCurrentValue(newValue.toString())
      onChange && onChange(newValue)
    }

    const handleIncreseValue = () => {
      const newValue = preValue.current + 1
      if (max && newValue > max) {
        return
      }
      preValue.current = newValue
      setCurrentValue(newValue.toString())
      onChange && onChange(newValue)
    }

    const handleChangeValue = (strValue: string) => {
      const number = Number(strValue)
      setCurrentValue(strValue)
      if (!isNaN(number)) {
        if (min && number < min) {
          preValue.current = min
        } else if (max && number > max) {
          preValue.current = max
        } else {
          preValue.current = number
        }
      }
      onChange && onChange(number)
    }

    const handleFocusInput = () => {
      setCurrentValue("")
    }

    const handleConfirmValue = () => {
      setCurrentValue(preValue.current.toString())
      onChange && onChange(preValue.current)
    }

    useLayoutEffect(() => {
      if (defaultValue) {
        preValue.current = defaultValue
        setCurrentValue(defaultValue.toString())
        onChange && onChange(defaultValue)
      }
    }, [defaultValue])

    useLayoutEffect(() => {
      if (value) {
        if(!preValue.current){
          preValue.current = value
        }
        setCurrentValue(value.toString())
      }
    }, [value])

    return (
      <div className={classNames("inline-flex items-center space-x-2", className)}>
        <Button onClick={handleDecreseValue} className="text-2xl" size="icon" type="button" variant="outline">
          -
        </Button>
        <Input
          ref={ref}
          min={min}
          max={max}
          value={currentValue}
          className={classNames(
            "h-[40px] text-lg rounded-none text-center w-[60px] bg-transparent border-b-2 border-l-0 border-t-0 border-r-0 border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 hide-arrow",
            inputClassName
          )}
          type="number"
          readOnly={!editable}
          onFocus={(e) => handleFocusInput()}
          onBlur={(e) => handleConfirmValue()}
          onChange={(e) => handleChangeValue(e.target.value)}
        />
        <Button onClick={handleIncreseValue} className="text-2xl" size="icon" type="button" variant="outline">
          +
        </Button>
      </div>
    )
  }
)

export default InputNumber
