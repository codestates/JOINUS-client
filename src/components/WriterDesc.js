import React from 'react'
export default function WriterDesc({ writer }) {
  return (
    <div key={writer.id} className="crtWriter">
      <p className="writer-name"> 작성자 이름: {writer.userName}</p>
      <p className="writer-company">  </p>
    </div>
  )
}