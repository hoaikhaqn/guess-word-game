import classNames from "classnames"
import React from "react"

type Props = {
  size?: number
  word: string
  wordSize?: number
  guessedLetters?: string[]
}

export default function GuessBox({ size = 40, word = "?", wordSize = 20, guessedLetters }: Props) {
  return (
    <div
      className={classNames(`inline-flex justify-center items-center bg-secondaryBackground rounded-md`)}
      style={{
        width: size,
        height: size,
        opacity: word != " " ? 1 : 0
      }}
    >
      <b style={{ fontSize: wordSize, opacity: guessedLetters?.includes(word) ? 1 : 0 }}>{word}</b>
    </div>
  )
}
