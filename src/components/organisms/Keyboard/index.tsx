import KeyBox from "@/components/molecules/KeyBox"
import { Button } from "@/components/ui/button"
import classNames from "classnames"
import React, { useEffect, useState } from "react"

let letters: string[] = []

// Thêm các chữ cái từ A đến Z vào mảng
for (let i = 65; i <= 90; i++) {
  letters.push(String.fromCharCode(i))
}

type Props = {
  correctKeys: string[]
  keysSubmitted: string[]
  disabled?: boolean
  onSubmit?: (key: string) => void
  onChange?: (key: string) => void
}

export default function Keyboard({ correctKeys = [], keysSubmitted = [], disabled = false, onSubmit, onChange }: Props) {
  const [keySelected, setKeySelected] = useState<string | null>(null)
  
  const handleSubmit = () => {
    setKeySelected(null)
    keySelected && onSubmit && onSubmit(keySelected)
  }

  useEffect(() => {
    keySelected && onChange && onChange(keySelected)
  }, [keySelected])
  

  return (
    <>
      <div className="text-center">
        <Button size="sm" onClick={handleSubmit} disabled={!keySelected}>
          Submit
        </Button>
      </div>
      <div className={classNames("flex justify-center flex-wrap gap-3")}>
        {letters.map((letter, index) => (
          <KeyBox
            key={letter + index}
            word={letter}
            className={classNames({
              "bg-danger-background hover:bg-danger-background border-danger text-danger":
                keysSubmitted.includes(letter) && !correctKeys.includes(letter),
              "bg-success-background hover:bg-success-background border-success text-success":
                keysSubmitted.includes(letter) && correctKeys.includes(letter)
            })}
            disabled={disabled || keysSubmitted.includes(letter)}
            onChange={(key) => !disabled && setKeySelected(key)}
            checked={keySelected === letter}
          />
        ))}
      </div>
    </>
  )
}
