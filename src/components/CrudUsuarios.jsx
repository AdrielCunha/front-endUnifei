import React, { useEffect, useState } from 'react'
import axios from "axios";
import { FaPencil, FaTrashCan } from 'react-icons/fa6';
import './CrudUsuarios.css'

export default function CrudUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [operacao, setOperacao] = useState("");

    const url = "https://backend-api-iota-lovat.vercel.app/usuarios/";
    
    useEffect(() => {
        fetch(url)
            .then((respFetch) => respFetch.json())
            .then((respJson) => setUsuarios(respJson))
            .catch((err) => console.log(err));
    }, [url]);

    function novosDados() {
        setOperacao("criarRegistro");
        limparDados()
    }

    function limparDados() {
        setId("");
        setNome("");
        setEmail("");
        setAltura("");
        setPeso("");
        //setOperacao("");
    }

    function editarDados(cod) {
        let usuario = usuarios.find((item) => item.id === cod);
        const { id, nome, email, altura, peso } = usuario;
        setOperacao("editarRegistro");
        setId(id);
        setNome(nome);
        setEmail(email);
        setAltura(altura);
        setPeso(peso);
    }

    function apagarDados(cod) {
        axios.delete(url + cod)
            .then(() => setUsuarios(usuarios.filter(item =>
                item.id !== cod)))
            .catch((erro) => alert(erro));
    }

    function gravarDados() {
        if (nome !== "" && email !== "") {
            if (operacao === "criarRegistro") {
                axios
                    .post(url, {
                        nome: nome,
                        email: email,
                        altura: (altura ? altura : null),
                        peso: (peso ? peso : null),
                    })
                    .then((response) => atualizaListaComNovoUsuario(response))
                    .catch((err) => alert(err));
            } else if (operacao === "editarRegistro") {
                axios
                    .put(url + id, {
                        id: id,
                        nome: nome,
                        email: email,
                        altura: (altura ? altura : null),
                        peso: (peso ? peso : null),
                    })
                    .then((response) => atualizaListaUsuarioEditado(response))
                    .catch((err) => alert(err));
            }
        } else {
            alert("Preencha os campos");
        }
    }

    function atualizaListaUsuarioEditado(response) {
        if (response.status == 202) {
            //encontra o indice do usuario a ser atualizado pelo id
            const index = usuarios.findIndex(item => item.id == id);
            //faz uma copia do array de usuarios
            let users = usuarios;
            //na copia, atualiza o usuario editado
            users[index].nome = nome;
            users[index].email = email;
            users[index].altura = altura;
            users[index].peso = peso;
            //seta os usuarios com o array editado
            setUsuarios(users);
            limparDados("");
        } else {
            console.log("Problema com edição: ", response.status);
        }
    }

    function atualizaListaComNovoUsuario(response) {
        console.log(response);
        let { id, nome, email, altura, peso } = response.data;
        let obj = {
            "id": id, "nome": nome, "email": email,
            "altura": altura, "peso": peso
        };
        let users = usuarios;
        users.push(obj);
        setUsuarios(users);
        limparDados("");
    }

    return (
        <div id="containerGeral">
            <button type="button"
                onClick={() => novosDados()}>Novo</button>
            <input
                type="text"
                name="txtNome"
                placeholder='Nome'
                value={nome}
                onChange={(e) => {
                    setNome(e.target.value);
                }}
            />
            <input
                type="text"
                name="txtEmail"
                placeholder='Email'
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);           
                }}
            />
            <input
                type="number"
                name="txtAltura"
                placeholder='Altura'
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
            />
            <input
                type="number"
                name="txtPeso"
                placeholder='Peso'
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
            />
            <button type="button" onClick={() => limparDados()}> Cancelar </button>
            <button type="button" onClick={() => gravarDados()}> Gravar </button>
            {usuarios ? usuarios.map((item) => {
                return (
                    <div key={item.id}>
                        {item.id} - {item.nome} - {item.email} - {item.altura} -
                        {item.peso} - {" "}
                        <FaPencil
                            onClick={(e) => editarDados(item.id)}
                        />
                        <FaTrashCan
                            onClick={(e) => apagarDados(item.id)}
                        />
                    </div>
                );
            })
                : false}
        </div>
    );
}
