# Gerador de Links do Google

Uma ferramenta simples para gerar links do Google de forma programática.

## 📋 Descrição

Este projeto fornece uma maneira fácil de gerar links de pesquisa do Google através de código. Útil para automação de buscas ou integração com outras aplicações.

## 🚀 Como usar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/generate-link-google.git
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o comando com os parâmetros desejados:
```bash
npm start -- --origin GRU --destination MCO --depart_date 2025-02-01 --return_date 2025-02-10 --adults 2 --type economy --max_stops 0 --infants_on_lap 1
```

Parâmetros disponíveis:
- `origin`: Aeroporto de origem (código IATA)
- `destination`: Aeroporto de destino (código IATA)
- `depart_date`: Data de ida (YYYY-MM-DD)
- `return_date`: Data de volta (YYYY-MM-DD)
- `adults`: Número de adultos
- `type`: Tipo de cabine (economy, business, first)
- `max_stops`: Número máximo de paradas
- `infants_on_lap`: Número de bebês no colo

## 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Felipe Vasconcellos

---

⭐️ Se este projeto foi útil para você, considere dar uma estrela!
