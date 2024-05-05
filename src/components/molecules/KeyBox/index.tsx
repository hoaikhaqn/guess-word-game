import { Button } from "@/components/ui/button"
import classNames from "classnames"
import React from "react"

type Props = {
  size?: number
  name?: string
  className?: string
  word: string
  wordSize?: number
  disabled?: boolean
  checked?: boolean
  onChange?: (key:string) => void
}

export default function KeyBox({
  name = "key",
  className,
  size = 40,
  word = "?",
  wordSize = 20,
  disabled = false,
  checked,
  onChange
}: Props) {
  return (
    <label htmlFor={word}>
      <input id={word} name={name} checked={checked} onChange={(e)=>onChange && onChange(e.target.value)} className="peer" value={word} type="radio" hidden disabled={disabled} />
      <div
        className={classNames(
          "p-0 text-center cursor-pointer rounded-md border-2 border-input font-bold text-xl hover:bg-accent peer-checked:bg-foreground peer-checked:text-primary-foreground ",
          { "cursor-not-allowed": disabled },
          className
        )}
        style={{
          width: size,
          height: size,
          lineHeight: `${size - 4}px`
        }}
      >
        {word}
      </div>
    </label>
  )
}
