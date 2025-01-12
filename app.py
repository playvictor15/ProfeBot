from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(_name_)
CORS(app)  # Permitir acesso do frontend
openai.api_key = "SUA_API_KEY_OPENAI"

# Banco de dados básico
redacao_dicas = [
    "Organize a redação em introdução, desenvolvimento e conclusão.",
    "Utilize conectivos para melhorar a coesão do texto.",
    "Evite usar primeira pessoa e mantenha uma linguagem formal."
]

questoes_enem = [
    {
        "id": 1,
        "pergunta": "Qual foi o tema da redação do ENEM 2022?",
        "opcoes": ["A) Democracia e cidadania", "B) Desafios da saúde pública", "C) Impactos da pandemia na educação"],
        "resposta": "C"
    },
    {
        "id": 2,
        "pergunta": "O que é uma tese na redação?",
        "opcoes": ["A) Uma opinião fundamentada", "B) Um resumo do texto", "C) Uma citação famosa"],
        "resposta": "A"
    }
]

@app.route("/dicas", methods=["GET"])
def dicas():
    return jsonify({"dicas": redacao_dicas})

@app.route("/quiz", methods=["GET"])
def quiz():
    return jsonify({"questoes": questoes_enem})

@app.route("/responder", methods=["POST"])
def responder():
    dados = request.json
    id_pergunta = dados.get("id")
    resposta_usuario = dados.get("resposta")

    # Localiza a questão
    questao = next((q for q in questoes_enem if q["id"] == id_pergunta), None)

    if questao:
        if resposta_usuario == questao["resposta"]:
            return jsonify({"resultado": "Correto! Parabéns!"})
        else:
            return jsonify({"resultado": f"Errado. A resposta correta é: {questao['resposta']}"})
    else:
        return jsonify({"erro": "Questão não encontrada."}), 404

@app.route("/duvidas", methods=["POST"])
def duvidas():
    dados = request.json
    pergunta = dados.get("pergunta")

    # Consulta ao GPT-3.5 para responder a dúvida
    try:
        resposta = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Responda como um professor de redação do ENEM: {pergunta}",
            max_tokens=150,
            temperature=0.7
        )
        return jsonify({"resposta": resposta.choices[0].text.strip()})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if _name_ == "_main_":
    app.run(debug=True)
