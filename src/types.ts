export interface Estabelecimento {
    id?: string;
    nome: string;
    descricao: string;
    fotoURL?: string;
    categoria: string;
    localizacao: {
      Endereco: string;
      Cidade: string;
      UF: string;
    };
    criadoEm?: string;
    responsavel_uid?: string;
    responsavelUid?: string;
  }

  export interface Procedimento {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    duracao_min: number;
    imagem_url?: string;
}


export interface Agendamento {
  id: string;
  cliente_id: string;
  cliente_nome?: string;
  procedimento: string;
  data_hora: string;
  profissional_id: string;
}
