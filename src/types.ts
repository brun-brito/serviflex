export interface Estabelecimento {
    id: string;
    nome: string;
    email: string;
    imagem_url?: string;
  }

  export interface Procedimento {
    id: string;
    nome: string;
    descricao: string;
    preco: number; // Adicionado o campo preço
    duracao_min: number; // Adicionado o campo duração em minutos
    imagem_url?: string; // Imagem do procedimento
}


export interface Agendamento {
  id: string;
  cliente_id: string;
  cliente_nome?: string; // novo campo
  procedimento: string;
  data_hora: string;
  profissional_id: string;
}
