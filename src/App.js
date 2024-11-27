import React, { useEffect, useState } from 'react'

export default function App() {

  const [contador, setContador] = useState(0);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9082/usuarios")
      .then((respFetch) => respFetch.json())
      .then((respJson) => setUsuarios(respJson))
      .catch((e) => console.log("Erro na promessa: ", e))
  }, [])

  useEffect(() => {
    console.log("Texto disparado no useEffect atualização")
  }, [contador])

  return (
    <div>
      <p>Paragrafo qualquer</p>
      <p>contador: {contador}</p>
      <button onClick={() => {
        setContador(contador + 1)
      }}>
        Mais 1
      </button>

      {usuarios.map((item) => {
        return(
          <p key={item.id}>{item.nome}</p>
        )
      })}

    </div>
  )
}
