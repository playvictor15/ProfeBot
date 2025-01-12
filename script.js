import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

function App() {
  const [dicas, setDicas] = useState([]);
  const [questoes, setQuestoes] = useState([]);
  const [duvida, setDuvida] = useState("");
  const [respostaDuvida, setRespostaDuvida] = useState("");
  const [quizResposta, setQuizResposta] = useState({});

  useEffect(() => {
    // Carregar dicas e questões ao carregar a página
    axios.get(${API_URL}/dicas).then((res) => setDicas(res.data.dicas));
    axios.get(${API_URL}/quiz).then((res) => setQuestoes(res.data.questoes));
  }, []);

  const enviarDuvida = () => {
    axios
      .post(${API_URL}/duvidas, { pergunta: duvida })
      .then((res) => setRespostaDuvida(res.data.resposta))
      .catch((err) => alert("Erro ao responder a dúvida!"));
  };

  const responderQuiz = (id, resposta) => {
    axios
      .post(${API_URL}/responder, { id, resposta })
      .then((res) => setQuizResposta((prev) => ({ ...prev, [id]: res.data.resultado })))
      .catch((err) => alert("Erro ao responder a questão!"));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Professor ENEM - Redação e Questões</h1>

      <section>
        <h2>Dicas de Redação</h2>
        <ul>
          {dicas.map((dica, index) => (
            <li key={index}>{dica}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Quiz ENEM</h2>
        {questoes.map((questao) => (
          <div key={questao.id} style={{ marginBottom: "20px" }}>
            <p>{questao.pergunta}</p>
            {questao.opcoes.map((opcao) => (
              <button
                key={opcao}
                onClick={() => responderQuiz(questao.id, opcao[0])}
                style={{ marginRight: "10px" }}
              >
                {opcao}
              </button>
            ))}
            {quizResposta[questao.id] && <p>{quizResposta[questao.id]}</p>}
          </div>
        ))}
      </section>

      <section>
        <h2>Tire sua Dúvida</h2>
        <textarea
          value={duvida}
          onChange={(e) => setDuvida(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Digite sua dúvida..."
        />
        <br />
        <button onClick={enviarDuvida}>Enviar</button>
        {respostaDuvida && <p>Resposta: {respostaDuvida}</p>}
      </section>
    </div>
  );
}

export default App;
